<?php
/**
 * Plugin Name: Nabbis Delivery Zones
 * Plugin URI: https://nabbiscollections.co.ke
 * Description: Advanced delivery zone management for Nabbis Collections with cost calculator, ETA tracking, and county-based shipping.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 8.0
 * Author: Nabbis Collections
 * Text Domain: nabbis-delivery
 * WC requires at least: 9.0
 * WC tested up to: 9.5
 */

if (!defined('ABSPATH')) exit;

define('NABBIS_DELIVERY_VERSION', '1.0.0');
define('NABBIS_DELIVERY_FILE', __FILE__);
define('NABBIS_DELIVERY_DIR', plugin_dir_path(__FILE__));
define('NABBIS_DELIVERY_URL', plugin_dir_url(__FILE__));

add_action('plugins_loaded', 'nabbis_delivery_init');
add_action('before_woocommerce_init', 'nabbis_delivery_hpos_compat');

function nabbis_delivery_hpos_compat() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
}

function nabbis_delivery_init() {
    if (!class_exists('WC_Shipping_Method')) return;

    require_once NABBIS_DELIVERY_DIR . 'includes/class-nabbis-delivery-method.php';
    require_once NABBIS_DELIVERY_DIR . 'includes/class-nabbis-delivery-admin.php';

    add_filter('woocommerce_shipping_methods', 'nabbis_delivery_add_method');
    add_action('woocommerce_order_details_after_order_table', 'nabbis_delivery_display_tracking');
    add_action('woocommerce_view_order', 'nabbis_delivery_display_tracking');

    new Nabbis_Delivery_Admin();
}

function nabbis_delivery_add_method($methods) {
    $methods['nabbis_delivery'] = 'Nabbis_Delivery_Method';
    return $methods;
}

function nabbis_delivery_display_tracking($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $tracking = $order->get_meta('_nabbis_delivery_tracking_number');
    $eta = $order->get_meta('_nabbis_delivery_eta');
    $courier = $order->get_meta('_nabbis_delivery_courier');

    if (!$tracking) return;

    echo '<section class="nabbis-delivery-tracking">';
    echo '<h2>' . esc_html__('Delivery Tracking', 'nabbis-delivery') . '</h2>';
    echo '<div class="nabbis-tracking-info">';
    echo '<p><strong>' . esc_html__('Courier:', 'nabbis-delivery') . '</strong> ' . esc_html($courier ?: 'Nabbis Delivery') . '</p>';
    echo '<p><strong>' . esc_html__('Tracking Number:', 'nabbis-delivery') . '</strong> <code>' . esc_html($tracking) . '</code></p>';
    if ($eta) {
        echo '<p><strong>' . esc_html__('Estimated Delivery:', 'nabbis-delivery') . '</strong> ' . esc_html($eta) . '</p>';
    }
    echo '</div>';
    echo '</section>';
}

register_activation_hook(__FILE__, 'nabbis_delivery_activate');
function nabbis_delivery_activate() {
    global $wpdb;
    $table = $wpdb->prefix . 'nabbis_delivery_zones';
    $charset = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        zone_name VARCHAR(100) NOT NULL,
        counties TEXT NOT NULL,
        base_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
        per_kg_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
        free_threshold DECIMAL(10,2) DEFAULT NULL,
        eta_min INT DEFAULT NULL,
        eta_max INT DEFAULT NULL,
        sort_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) $charset;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);

    nabbis_delivery_seed_zones();
}

function nabbis_delivery_seed_zones() {
    global $wpdb;
    $table = $wpdb->prefix . 'nabbis_delivery_zones';

    $count = $wpdb->get_var("SELECT COUNT(*) FROM $table");
    if ($count > 0) return;

    $zones = [
        [
            'zone_name'      => 'Nairobi',
            'counties'       => 'Nairobi',
            'base_rate'      => 200,
            'per_kg_rate'    => 30,
            'free_threshold' => 5000,
            'eta_min'        => 0,
            'eta_max'        => 1,
            'sort_order'     => 1,
        ],
        [
            'zone_name'      => 'Mombasa',
            'counties'       => 'Mombasa,Kilifi,Kwale',
            'base_rate'      => 300,
            'per_kg_rate'    => 50,
            'free_threshold' => 5000,
            'eta_min'        => 1,
            'eta_max'        => 3,
            'sort_order'     => 2,
        ],
        [
            'zone_name'      => 'Kisumu',
            'counties'       => 'Kisumu,Siaya,Homa Bay,Migori,Kisii,Nyamira',
            'base_rate'      => 350,
            'per_kg_rate'    => 50,
            'free_threshold' => 5000,
            'eta_min'        => 2,
            'eta_max'        => 4,
            'sort_order'     => 3,
        ],
        [
            'zone_name'      => 'Nakuru',
            'counties'       => 'Nakuru,Narok,Baringo,Laikipia,Nyeri,Kericho',
            'base_rate'      => 300,
            'per_kg_rate'    => 50,
            'free_threshold' => 5000,
            'eta_min'        => 1,
            'eta_max'        => 3,
            'sort_order'     => 4,
        ],
        [
            'zone_name'      => 'Eldoret',
            'counties'       => 'Uasin Gishu,Trans Nzoia,West Pokot,Elgeyo Marakwet,Nandi',
            'base_rate'      => 350,
            'per_kg_rate'    => 60,
            'free_threshold' => 5000,
            'eta_min'        => 2,
            'eta_max'        => 4,
            'sort_order'     => 5,
        ],
        [
            'zone_name'      => 'Machakos',
            'counties'       => 'Machakos,Makueni,Kajiado,Kitui,Kamba',
            'base_rate'      => 300,
            'per_kg_rate'    => 50,
            'free_threshold' => 5000,
            'eta_min'        => 1,
            'eta_max'        => 3,
            'sort_order'     => 6,
        ],
        [
            'zone_name'      => 'Rest of Kenya',
            'counties'       => '',
            'base_rate'      => 500,
            'per_kg_rate'    => 80,
            'free_threshold' => 7000,
            'eta_min'        => 3,
            'eta_max'        => 7,
            'sort_order'     => 99,
        ],
    ];

    foreach ($zones as $zone) {
        $wpdb->insert($table, $zone);
    }
}
