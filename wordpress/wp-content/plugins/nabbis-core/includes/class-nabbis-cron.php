<?php
if (!defined('ABSPATH')) exit;

class Nabbis_Cron {

    public function __construct() {
        add_action('init', [$this, 'register_schedules']);
        add_action('nabbis_cleanup_expired_carts', [$this, 'cleanup_carts']);
        add_action('nabbis_daily_maintenance', [$this, 'daily_maintenance']);
    }

    public function register_schedules() {
        if (!wp_next_scheduled('nabbis_daily_maintenance')) {
            wp_schedule_event(time(), 'daily', 'nabbis_daily_maintenance');
        }
    }

    public function cleanup_carts() {
        global $wpdb;
        $wpdb->query("DELETE FROM {$wpdb->prefix}woocommerce_sessions WHERE session_expiry < " . (time() - DAY_IN_SECONDS * 7));
    }

    public function daily_maintenance() {
        $this->cleanup_carts();

        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_mpesa_transactions';
        $wpdb->query("UPDATE $table SET status = 'timeout' WHERE status = 'pending' AND created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)");

        $orders = wc_get_orders([
            'status' => ['on-hold'],
            'limit'  => 50,
            'meta_key' => '_nabbis_mpesa_checkout_request_id',
            'date_created' => '<' . (time() - HOUR_IN_SECONDS),
        ]);

        foreach ($orders as $order) {
            $checkout_id = $order->get_meta('_nabbis_mpesa_checkout_request_id');
            if ($checkout_id) {
                $order->update_status('cancelled', __('M-Pesa payment timeout - automatically cancelled.', 'nabbis-core'));
            }
        }
    }
}
