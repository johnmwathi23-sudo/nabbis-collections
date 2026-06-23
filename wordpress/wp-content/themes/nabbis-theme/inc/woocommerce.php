<?php
if (!defined('ABSPATH')) exit;

add_filter('woocommerce_enqueue_styles', '__return_empty_array');
add_filter('loop_shop_per_page', fn() => 24);
add_filter('woocommerce_product_loop_start', 'nabbis_product_loop_start');
add_filter('woocommerce_product_loop_end', 'nabbis_product_loop_end');
add_filter('woocommerce_before_main_content', 'nabbis_wc_before_main_content', 5);
add_filter('woocommerce_after_main_content', 'nabbis_wc_after_main_content', 20);
add_action('after_setup_theme', 'nabbis_wc_setup');
add_filter('woocommerce_output_related_products_args', 'nabbis_related_products_args');
add_filter('woocommerce_cross_sells_total', fn() => 4);
add_filter('woocommerce_cross_sells_columns', fn() => 4);
add_filter('woocommerce_pagination_args', 'nabbis_pagination_args');

function nabbis_wc_setup() {
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    add_theme_support('woocommerce-blocks');

    if (class_exists('Automattic\WooCommerce\Utilities\FeaturesUtil')) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', NABBIS_THEME_DIR . '/style.css', true);
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('cart_checkout_blocks', NABBIS_THEME_DIR . '/style.css', true);
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('product_block_editor', NABBIS_THEME_DIR . '/style.css', true);
    }
}

function nabbis_product_loop_start() {
    return '<div class="nabbis-products-grid">';
}

function nabbis_product_loop_end() {
    return '</div>';
}

function nabbis_wc_before_main_content() {
    echo '<main class="nabbis-main-content">';
    echo '<div class="nabbis-container">';
}

function nabbis_wc_after_main_content() {
    echo '</div>';
    echo '</main>';
}

function nabbis_related_products_args($args) {
    $args['posts_per_page'] = 4;
    $args['columns'] = 4;
    return $args;
}

function nabbis_pagination_args($args) {
    $args['prev_text'] = '&laquo;';
    $args['next_text'] = '&raquo;';
    $args['type'] = 'list';
    return $args;
}

add_filter('woocommerce_add_to_cart_fragments', 'nabbis_cart_fragment');
function nabbis_cart_fragment($fragments) {
    ob_start();
    $count = WC()->cart->get_cart_contents_count();
    echo '<span class="nabbis-cart-count">' . esc_html($count) . '</span>';
    $fragments['.nabbis-cart-count'] = ob_get_clean();

    ob_start();
    echo wc_price(WC()->cart->get_cart_total());
    $fragments['.nabbis-cart-total'] = ob_get_clean();

    return $fragments;
}

add_filter('woocommerce_show_page_title', '__return_false');

remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20);
add_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 5);

remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10);
add_action('woocommerce_single_product_summary', 'woocommerce_template_single_rating', 25);

add_action('woocommerce_before_shop_loop_item_title', 'nabbis_product_thumbnail_wrap_start', 5);
add_action('woocommerce_before_shop_loop_item_title', 'nabbis_product_thumbnail_wrap_end', 15);
function nabbis_product_thumbnail_wrap_start() {
    echo '<div class="nabbis-product-thumbnail">';
}
function nabbis_product_thumbnail_wrap_end() {
    echo '</div>';
}

add_action('woocommerce_before_shop_loop_item', 'nabbis_product_item_wrap_start', 5);
add_action('woocommerce_after_shop_loop_item', 'nabbis_product_item_wrap_end', 20);
function nabbis_product_item_wrap_start() {
    echo '<div class="nabbis-product-item">';
}
function nabbis_product_item_wrap_end() {
    echo '</div>';
}
