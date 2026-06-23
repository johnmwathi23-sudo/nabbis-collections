<?php
/**
 * Nabbis Collections Theme Functions
 */

if (!defined('ABSPATH')) exit;

define('NABBIS_THEME_VERSION', '1.0.0');
define('NABBIS_THEME_DIR', get_template_directory());
define('NABBIS_THEME_URI', get_template_directory_uri());

require_once NABBIS_THEME_DIR . '/inc/theme-setup.php';
require_once NABBIS_THEME_DIR . '/inc/enqueue.php';
require_once NABBIS_THEME_DIR . '/inc/woocommerce.php';
require_once NABBIS_THEME_DIR . '/inc/acf-fields.php';
require_once NABBIS_THEME_DIR . '/inc/customizer.php';
require_once NABBIS_THEME_DIR . '/inc/performance.php';
require_once NABBIS_THEME_DIR . '/inc/security.php';

add_action('after_setup_theme', 'nabbis_theme_setup');
add_action('wp_enqueue_scripts', 'nabbis_enqueue_assets');
add_action('enqueue_block_editor_assets', 'nabbis_enqueue_editor_assets');
add_action('init', 'nabbis_register_block_patterns');
add_filter('upload_mimes', 'nabbis_svg_mime_types');
add_filter('wp_kses_allowed_html', 'nabbis_svg_allowed_html', 10, 2);
