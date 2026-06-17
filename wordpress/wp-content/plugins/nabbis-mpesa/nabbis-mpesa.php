<?php
/**
 * Plugin Name: Nabbis M-Pesa Gateway
 * Plugin URI: https://nabbiscollections.co.ke
 * Description: M-Pesa payment gateway for Nabbis Collections - STK Push, Paybill & Till Number support.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 8.0
 * Author: Nabbis Collections
 * Author URI: https://nabbiscollections.co.ke
 * Text Domain: nabbis-mpesa
 * Domain Path: /languages
 * WC requires at least: 9.0
 * WC tested up to: 9.5
 */

if (!defined('ABSPATH')) exit;

define('NABBIS_MPESA_VERSION', '1.0.0');
define('NABBIS_MPESA_FILE', __FILE__);
define('NABBIS_MPESA_DIR', plugin_dir_path(__FILE__));
define('NABBIS_MPESA_URL', plugin_dir_url(__FILE__));

add_action('plugins_loaded', 'nabbis_mpesa_init', 20);
add_action('before_woocommerce_init', 'nabbis_mpesa_hpos_compat');

function nabbis_mpesa_hpos_compat() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('cart_checkout_blocks', __FILE__, true);
    }
}

function nabbis_mpesa_init() {
    if (!class_exists('WC_Payment_Gateway')) return;

    require_once NABBIS_MPESA_DIR . 'includes/class-wc-gateway-nabbis-mpesa.php';
    require_once NABBIS_MPESA_DIR . 'includes/class-nabbis-mpesa-api.php';
    require_once NABBIS_MPESA_DIR . 'includes/class-nabbis-mpesa-callback.php';
    require_once NABBIS_MPESA_DIR . 'includes/class-nabbis-mpesa-admin.php';

    add_filter('woocommerce_payment_gateways', 'nabbis_mpesa_add_gateway');
    add_filter('woocommerce_currencies', 'nabbis_mpesa_add_kes_currency');
    add_filter('woocommerce_currency_symbol', 'nabbis_mpesa_kes_symbol', 10, 2);

    add_action('rest_api_init', function () {
        $callback = new Nabbis_MPesa_Callback();
        $callback->register_routes();
    });

    add_action('wp_enqueue_scripts', 'nabbis_mpesa_scripts');
    add_action('wp_ajax_nabbis_mpesa_check_status', 'nabbis_mpesa_check_status');
    add_action('wp_ajax_nopriv_nabbis_mpesa_check_status', 'nabbis_mpesa_check_status');
}

function nabbis_mpesa_check_status() {
    check_ajax_referer('nabbis_nonce', 'nonce');

    $order_id = intval($_POST['order_id']);
    if (!$order_id) {
        wp_send_json_error(['message' => 'Invalid order ID']);
    }

    $order = wc_get_order($order_id);
    if (!$order) {
        wp_send_json_error(['message' => 'Order not found']);
    }

    $checkout_id = $order->get_meta('_nabbis_mpesa_checkout_request_id');
    if (!$checkout_id) {
        wp_send_json_error(['message' => 'No M-Pesa request']);
    }

    global $wpdb;
    $table = $wpdb->prefix . 'nabbis_mpesa_transactions';
    $transaction = $wpdb->get_row($wpdb->prepare(
        "SELECT status, mpesa_receipt, result_desc FROM $table WHERE checkout_request_id = %s ORDER BY id DESC LIMIT 1",
        $checkout_id
    ));

    if (!$transaction) {
        wp_send_json_success(['status' => 'pending']);
    }

    wp_send_json_success([
        'status'  => $transaction->status,
        'receipt' => $transaction->mpesa_receipt,
        'message' => $transaction->result_desc,
    ]);
}

function nabbis_mpesa_add_gateway($gateways) {
    $gateways[] = 'WC_Gateway_Nabbis_MPesa';
    return $gateways;
}

function nabbis_mpesa_add_kes_currency($currencies) {
    $currencies['KES'] = __('Kenyan Shilling', 'nabbis-mpesa');
    return $currencies;
}

function nabbis_mpesa_kes_symbol($symbol, $currency) {
    if ($currency === 'KES') return 'KSh ';
    return $symbol;
}

function nabbis_mpesa_scripts() {
    if (is_checkout()) {
        wp_enqueue_style('nabbis-mpesa', NABBIS_MPESA_URL . 'assets/mpesa.css', [], NABBIS_MPESA_VERSION);
        wp_enqueue_script('nabbis-mpesa', NABBIS_MPESA_URL . 'assets/mpesa.js', ['jquery', 'wc-checkout'], NABBIS_MPESA_VERSION, true);
        wp_localize_script('nabbis-mpesa', 'nabbisMpesa', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('nabbis_mpesa_nonce'),
        ]);
    }
}

register_activation_hook(__FILE__, 'nabbis_mpesa_activate');
function nabbis_mpesa_activate() {
    global $wpdb;
    $table = $wpdb->prefix . 'nabbis_mpesa_transactions';
    $charset = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT UNSIGNED DEFAULT NULL,
        merchant_request_id VARCHAR(100) DEFAULT NULL,
        checkout_request_id VARCHAR(100) DEFAULT NULL,
        result_code INT DEFAULT NULL,
        result_desc VARCHAR(255) DEFAULT NULL,
        amount DECIMAL(12,2) DEFAULT NULL,
        mpesa_receipt VARCHAR(50) DEFAULT NULL,
        transaction_date VARCHAR(20) DEFAULT NULL,
        phone_number VARCHAR(20) DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        raw_response LONGTEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_order (order_id),
        INDEX idx_checkout (checkout_request_id),
        INDEX idx_receipt (mpesa_receipt),
        INDEX idx_status (status)
    ) $charset;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
}
