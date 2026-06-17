<?php
if (!defined('ABSPATH')) exit;

function nabbis_theme_setup() {
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('custom-line-height');
    add_theme_support('custom-spacing');
    add_theme_support('custom-units');
    add_theme_support('link-color');
    add_theme_support('appearance-tools');
    add_theme_support('block-nav-menus');
    add_theme_support('custom-logo', [
        'height'      => 80,
        'width'       => 240,
        'flex-width'  => true,
        'flex-height' => true,
    ]);
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    register_nav_menus([
        'primary'   => __('Primary Menu', 'nabbis-theme'),
        'secondary' => __('Secondary Menu', 'nabbis-theme'),
        'mobile'    => __('Mobile Menu', 'nabbis-theme'),
        'footer'    => __('Footer Menu', 'nabbis-theme'),
        'social'    => __('Social Menu', 'nabbis-theme'),
        'topbar'    => __('Top Bar Menu', 'nabbis-theme'),
    ]);

    add_editor_style('assets/css/editor.css');

    $font_url = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap';
    add_editor_style(str_replace(',', '%2C', $font_url));
}

function nabbis_svg_mime_types($mimes) {
    $mimes['svg']  = 'image/svg+xml';
    $mimes['webp'] = 'image/webp';
    $mimes['avif'] = 'image/avif';
    return $mimes;
}

function nabbis_svg_allowed_html($allowed, $context) {
    if ($context === 'post' || $context === 'wp_kses_normalize_entities') {
        $allowed['svg'] = [
            'xmlns'       => true,
            'viewbox'     => true,
            'width'       => true,
            'height'      => true,
            'fill'        => true,
            'stroke'      => true,
            'class'       => true,
            'aria-hidden' => true,
        ];
        $allowed['path'] = [
            'd'       => true,
            'fill'    => true,
            'stroke'  => true,
            'class'   => true,
        ];
        $allowed['circle'] = [
            'cx' => true,
            'cy' => true,
            'r'  => true,
            'fill' => true,
        ];
        $allowed['rect'] = [
            'x'      => true,
            'y'      => true,
            'width'  => true,
            'height' => true,
            'fill'   => true,
            'rx'     => true,
        ];
    }
    return $allowed;
}

function nabbis_register_block_patterns() {
    register_block_pattern_category('nabbis/hero', [
        'label' => __('Nabbis: Hero Sections', 'nabbis-theme'),
    ]);
    register_block_pattern_category('nabbis/products', [
        'label' => __('Nabbis: Product Sections', 'nabbis-theme'),
    ]);
    register_block_pattern_category('nabbis/content', [
        'label' => __('Nabbis: Content Blocks', 'nabbis-theme'),
    ]);
    register_block_pattern_category('nabbis/footer', [
        'label' => __('Nabbis: Footer Elements', 'nabbis-theme'),
    ]);
}
