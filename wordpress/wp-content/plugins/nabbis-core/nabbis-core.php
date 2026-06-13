<?php
/**
 * Plugin Name: Nabbis Core
 * Plugin URI: https://nabbiscollections.co.ke
 * Description: Core functionality for Nabbis Collections - shared utilities, WooCommerce customizations, wishlist, compare, and loyalty system.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 8.0
 * Author: Nabbis Collections
 * Text Domain: nabbis-core
 * Domain Path: /languages
 * WC requires at least: 9.0
 * WC tested up to: 9.5
 */

if (!defined('ABSPATH')) exit;

define('NABBIS_CORE_VERSION', '1.0.0');
define('NABBIS_CORE_FILE', __FILE__);
define('NABBIS_CORE_DIR', plugin_dir_path(__FILE__));
define('NABBIS_CORE_URL', plugin_dir_url(__FILE__));

add_action('plugins_loaded', 'nabbis_core_init');
add_action('before_woocommerce_init', 'nabbis_core_hpos_compat');

function nabbis_core_hpos_compat() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('cart_checkout_blocks', __FILE__, true);
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('product_block_editor', __FILE__, true);
    }
}

function nabbis_core_init() {
    require_once NABBIS_CORE_DIR . 'includes/class-nabbis-cron.php';
    require_once NABBIS_CORE_DIR . 'includes/class-nabbis-wishlist.php';
    require_once NABBIS_CORE_DIR . 'includes/class-nabbis-compare.php';
    require_once NABBIS_CORE_DIR . 'includes/class-nabbis-loyalty.php';
    require_once NABBIS_CORE_DIR . 'includes/class-nabbis-referrals.php';
    require_once NABBIS_CORE_DIR . 'includes/class-nabbis-cart-recovery.php';

    add_action('init', 'nabbis_core_register_endpoints');
    add_action('wp_enqueue_scripts', 'nabbis_core_scripts');
    add_filter('woocommerce_account_menu_items', 'nabbis_core_account_menu', 40);
    add_action('init', 'nabbis_core_rewrite_rules');

    new Nabbis_Cron();
    new Nabbis_Wishlist();
    new Nabbis_Compare();
    new Nabbis_Loyalty();
    new Nabbis_Referrals();
    new Nabbis_Cart_Recovery();

    add_action('init', function() {
        add_rewrite_endpoint('wishlist', EP_ROOT | EP_PAGES);
        add_rewrite_endpoint('compare', EP_ROOT | EP_PAGES);
        add_rewrite_endpoint('loyalty-points', EP_ROOT | EP_PAGES);
        add_rewrite_endpoint('referrals', EP_ROOT | EP_PAGES);
    });
}

function nabbis_core_register_endpoints() {
    add_rewrite_endpoint('wishlist', EP_ROOT | EP_PAGES);
    add_rewrite_endpoint('compare', EP_ROOT | EP_PAGES);
    add_rewrite_endpoint('loyalty-points', EP_ROOT | EP_PAGES);
    add_rewrite_endpoint('referrals', EP_ROOT | EP_PAGES);
}

function nabbis_core_account_menu($items) {
    $logout = $items['customer-logout'];
    unset($items['customer-logout']);

    $items['wishlist']       = __('Wishlist', 'nabbis-core');
    $items['compare']        = __('Compare', 'nabbis-core');
    $items['loyalty-points'] = __('Loyalty Points', 'nabbis-core');
    $items['referrals']      = __('Referrals', 'nabbis-core');
    $items['customer-logout'] = $logout;

    return $items;
}

function nabbis_core_scripts() {
    if (is_account_page() || is_product()) {
        wp_enqueue_style('nabbis-core', NABBIS_CORE_URL . 'assets/core.css', [], NABBIS_CORE_VERSION);
        wp_enqueue_script('nabbis-core', NABBIS_CORE_URL . 'assets/core.js', ['jquery'], NABBIS_CORE_VERSION, true);
        wp_localize_script('nabbis-core', 'nabbisCore', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('nabbis_core_nonce'),
        ]);
    }
}

function nabbis_core_rewrite_rules() {
    flush_rewrite_rules();
}
