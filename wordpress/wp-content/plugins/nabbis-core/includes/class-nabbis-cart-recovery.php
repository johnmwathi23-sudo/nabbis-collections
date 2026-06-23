<?php
if (!defined('ABSPATH')) exit;

class Nabbis_Cart_Recovery {

    public function __construct() {
        add_action('woocommerce_cart_updated', [$this, 'track_cart']);
        add_action('wp', [$this, 'schedule_recovery']);
        add_action('nabbis_abandoned_cart_hourly', [$this, 'process_recovery']);
    }

    public function track_cart() {
        if (!is_user_logged_in() || is_admin()) return;

        $user_id = get_current_user_id();
        $cart = WC()->cart;

        if ($cart->is_empty()) {
            delete_user_meta($user_id, '_nabbis_abandoned_cart');
            return;
        }

        $cart_data = [
            'time'    => current_time('mysql'),
            'items'   => $cart->get_cart_contents(),
            'total'   => $cart->get_cart_total(),
            'coupons' => $cart->get_applied_coupons(),
        ];

        update_user_meta($user_id, '_nabbis_abandoned_cart', $cart_data);

        if (!get_user_meta($user_id, '_nabbis_cart_reminder_sent', true)) {
            // First abandonment detected
        }
    }

    public function schedule_recovery() {
        if (!wp_next_scheduled('nabbis_abandoned_cart_hourly')) {
            wp_schedule_event(time(), 'hourly', 'nabbis_abandoned_cart_hourly');
        }
    }

    public function process_recovery() {
        global $wpdb;

        $users = get_users([
            'meta_key'     => '_nabbis_abandoned_cart',
            'meta_compare' => 'EXISTS',
            'fields'       => ['ID', 'user_email', 'display_name'],
        ]);

        foreach ($users as $user) {
            $cart_data = get_user_meta($user->ID, '_nabbis_abandoned_cart', true);
            if (!is_array($cart_data)) continue;

            $last_updated = strtotime($cart_data['time']);
            $hours_ago = (current_time('timestamp') - $last_updated) / HOUR_IN_SECONDS;
            $last_reminder = (int) get_user_meta($user->ID, '_nabbis_cart_reminder_count', true);

            if ($hours_ago >= 2 && $last_reminder < 1) {
                $this->send_reminder($user, $cart_data, 'first');
                update_user_meta($user->ID, '_nabbis_cart_reminder_count', 1);
            } elseif ($hours_ago >= 24 && $last_reminder < 2) {
                $this->send_reminder($user, $cart_data, 'second');
                update_user_meta($user->ID, '_nabbis_cart_reminder_count', 2);
            } elseif ($hours_ago >= 72 && $last_reminder < 3) {
                $this->send_reminder($user, $cart_data, 'final');
                update_user_meta($user->ID, '_nabbis_cart_reminder_count', 3);
                update_user_meta($user->ID, '_nabbis_cart_reminder_sent', current_time('mysql'));
            }
        }
    }

    private function send_reminder($user, $cart_data, $type) {
        $to = $user->user_email;
        $items_count = count($cart_data['items']);
        $total = $cart_data['total'];
        $cart_url = wc_get_cart_url();

        switch ($type) {
            case 'first':
                $subject = __('You left something in your cart!', 'nabbis-core');
                $message = sprintf(
                    __('Hi %s, you have %d items waiting in your cart. Complete your order now!', 'nabbis-core'),
                    $user->display_name,
                    $items_count
                );
                break;
            case 'second':
                $subject = __('Still thinking about it?', 'nabbis-core');
                $message = sprintf(
                    __('Your cart with %d items (%s) is still waiting. Don\'t miss out!', 'nabbis-core'),
                    $items_count,
                    $total
                );
                break;
            case 'final':
                $subject = __('Last chance! Your cart is expiring', 'nabbis-core');
                $message = sprintf(
                    __('This is your final reminder! Your cart with %d items will be cleared soon. Complete your purchase now.', 'nabbis-core'),
                    $items_count
                );
                break;
        }

        $message .= "\n\n" . __('View your cart:', 'nabbis-core') . ' ' . $cart_url;
        $message .= "\n\n" . __('Thank you,', 'nabbis-core') . "\n" . get_bloginfo('name');

        wp_mail($to, $subject, $message, [
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . get_bloginfo('name') . ' <' . get_option('admin_email') . '>',
        ]);
    }
}
