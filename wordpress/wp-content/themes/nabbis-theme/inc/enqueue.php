<?php
if (!defined('ABSPATH')) exit;

function nabbis_enqueue_assets() {
    $theme_version = wp_get_theme()->get('Version');

    wp_enqueue_style('nabbis-google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap', [], null);
    wp_enqueue_style('nabbis-theme', NABBIS_THEME_URI . '/assets/css/theme.css', ['nabbis-google-fonts'], $theme_version);
    wp_enqueue_style('nabbis-woocommerce', NABBIS_THEME_URI . '/assets/css/woocommerce.css', ['nabbis-theme', 'woocommerce-general'], $theme_version);

    if (is_rtl()) {
        wp_enqueue_style('nabbis-rtl', NABBIS_THEME_URI . '/assets/css/rtl.css', ['nabbis-theme'], $theme_version);
    }

    wp_enqueue_script('nabbis-theme', NABBIS_THEME_URI . '/assets/js/theme.js', ['jquery'], $theme_version, true);

    $localize_data = [
        'ajaxUrl'   => admin_url('admin-ajax.php'),
        'nonce'     => wp_create_nonce('nabbis_nonce'),
        'cartUrl'   => wc_get_cart_url(),
        'checkoutUrl' => wc_get_checkout_url(),
        'isMobile'  => wp_is_mobile(),
        'currency'  => get_woocommerce_currency_symbol(),
    ];
    wp_localize_script('nabbis-theme', 'nabbisData', $localize_data);

    if (is_shop() || is_product_category() || is_product_tag() || is_product()) {
        wp_enqueue_script('nabbis-zoom', NABBIS_THEME_URI . '/assets/js/product-zoom.js', ['jquery'], $theme_version, true);
    }

    if (is_checkout()) {
        wp_enqueue_script('nabbis-checkout', NABBIS_THEME_URI . '/assets/js/checkout.js', ['jquery', 'wc-checkout'], $theme_version, true);
    }

    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('classic-theme-styles');
}

function nabbis_enqueue_editor_assets() {
    wp_enqueue_style('nabbis-editor-google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap', [], null);
    wp_enqueue_style('nabbis-editor', NABBIS_THEME_URI . '/assets/css/editor.css', ['nabbis-editor-google-fonts'], wp_get_theme()->get('Version'));
}
