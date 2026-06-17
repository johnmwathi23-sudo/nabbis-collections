<?php
/**
 * Must-Use Plugin: Nabbis Essentials
 * Description: Critical security, performance, and environment settings.
 */

if (!defined('ABSPATH')) exit;

// Redis Object Cache
if (defined('WP_REDIS_HOST') && !defined('WP_CACHE')) {
    define('WP_CACHE', true);
}

// Disable file editing
define('DISALLOW_FILE_EDIT', true);

// Limit post revisions
define('WP_POST_REVISIONS', 5);

// Increase memory for admin
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// Automatic updates for security only
add_filter('auto_update_core', '__return_false');
add_filter('auto_update_plugin', fn($update, $item) => in_array($item->slug, ['woocommerce', 'wordfence', 'rank-math', 'wp-rocket']), 10, 2);
add_filter('auto_update_theme', '__return_false');

// Disable XML-RPC
add_filter('xmlrpc_enabled', '__return_false');

// Disable REST API for non-logged-in users (except WooCommerce)
add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) return $result;
    if (!is_user_logged_in()) {
        $route = $GLOBALS['wp']->query_vars['rest_route'] ?? '';
        $allowed = ['/wc/', '/nabbis-mpesa/', '/oembed/'];
        foreach ($allowed as $prefix) {
            if (strpos($route, $prefix) === 0) return $result;
        }
        return new WP_Error('rest_not_logged_in', __('Please log in.', 'nabbis-core'), ['status' => 401]);
    }
    return $result;
});

// Security headers
add_action('send_headers', function() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
    }
});

// Disable user enumeration
add_action('init', function() {
    if (isset($_REQUEST['author']) && is_numeric($_REQUEST['author'])) {
        wp_redirect(home_url(), 301);
        exit;
    }
});

// Upload limits
@ini_set('upload_max_size', '128M');
@ini_set('post_max_size', '128M');
@ini_set('max_execution_time', '300');
