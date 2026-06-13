<?php
if (!defined('ABSPATH')) exit;

add_filter('login_errors', 'nabbis_login_errors');
function nabbis_login_errors() {
    return __('Invalid login credentials.', 'nabbis-theme');
}

add_filter('rest_authentication_errors', 'nabbis_rest_api_limit');
function nabbis_rest_api_limit($result) {
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in()) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $transient = 'nabbis_rest_attempts_' . md5($ip);
        $attempts = (int) get_transient($transient);
        if ($attempts > 60) {
            return new WP_Error('rest_rate_limit', __('Too many requests. Please try again later.', 'nabbis-theme'), ['status' => 429]);
        }
        set_transient($transient, $attempts + 1, 3600);
    }
    return $result;
}

add_action('wp_login_failed', 'nabbis_login_failed_track');
function nabbis_login_failed_track($username) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $transient = 'nabbis_login_attempts_' . md5($ip);
    $attempts = (int) get_transient($transient);
    set_transient($transient, $attempts + 1, 900);
    if ($attempts >= 5) {
        sleep(3);
    }
}

add_filter('xmlrpc_enabled', '__return_false');

add_filter('wp_headers', 'nabbis_remove_x_pingback');
function nabbis_remove_x_pingback($headers) {
    unset($headers['X-Pingback']);
    return $headers;
}

add_action('admin_init', 'nabbis_hide_wp_version');
function nabbis_hide_wp_version() {
    remove_filter('update_footer', 'core_update_footer');
}

add_action('init', function() {
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    add_filter('the_generator', '__return_empty_string');
});

add_filter('wpcf7_load_js', '__return_false');
add_filter('wpcf7_load_css', '__return_false');

add_action('admin_notices', 'nabbis_ssl_check');
function nabbis_ssl_check() {
    if (!is_ssl() && !defined('WP_DEBUG') || !WP_DEBUG) {
        ?>
        <div class="notice notice-warning">
            <p><?php _e('Nabbis Collections: SSL is not enabled. Please enable HTTPS for security.', 'nabbis-theme'); ?></p>
        </div>
        <?php
    }
}

add_action('init', function() {
    if (!is_admin() && !is_ssl() && !defined('WP_DEBUG') || !WP_DEBUG) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            wp_redirect($redirect, 301);
            exit;
        }
    }
});
