<?php
if (!defined('ABSPATH')) exit;

add_action('init', 'nabbis_performance_optimizations');
function nabbis_performance_optimizations() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
    remove_action('wp_head', 'wp_oembed_add_host_js');
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'index_rel_link');
    remove_action('wp_head', 'parent_post_rel_link', 10);
    remove_action('wp_head', 'start_post_rel_link', 10);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10);
    remove_action('wp_head', 'wp_generator');
}

add_action('wp_default_scripts', 'nabbis_remove_jquery_migrate');
function nabbis_remove_jquery_migrate($scripts) {
    if (!is_admin() && isset($scripts->registered['jquery'])) {
        $script = $scripts->registered['jquery'];
        if ($script->deps) {
            $script->deps = array_diff($script->deps, ['jquery-migrate']);
        }
    }
}

add_filter('wp_lazy_loading_enabled', '__return_true');

add_action('template_redirect', 'nabbis_cache_headers');
function nabbis_cache_headers() {
    if (is_user_logged_in() || is_admin() || is_cart() || is_checkout() || is_account_page()) {
        return;
    }
    if (!session_id() && !headers_sent()) {
        session_start();
    }
}

add_action('send_headers', 'nabbis_add_security_headers');
function nabbis_add_security_headers() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }
}

add_filter('wp_get_attachment_image_attributes', 'nabbis_lazy_load_attributes', 10, 3);
function nabbis_lazy_load_attributes($attr, $attachment, $size) {
    if (!is_admin()) {
        $attr['loading'] = 'lazy';
        $attr['decoding'] = 'async';
    }
    return $attr;
}

add_action('init', function() {
    if (function_exists('wp_register_script') && !is_admin()) {
        wp_register_script('nabbis-critical-css', false, [], null, true);
        wp_add_inline_script('nabbis-critical-css', '
            document.documentElement.classList.remove("no-js");
        ');
        wp_enqueue_script('nabbis-critical-css');
    }
});
