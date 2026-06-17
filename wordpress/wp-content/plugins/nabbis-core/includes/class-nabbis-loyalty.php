<?php
if (!defined('ABSPATH')) exit;

class Nabbis_Loyalty {

    const POINTS_PER_KSH = 1;
    const KSH_PER_POINT_REDEEM = 0.1;

    public function __construct() {
        add_action('woocommerce_order_status_completed', [$this, 'award_points']);
        add_action('woocommerce_account_loyalty-points_endpoint', [$this, 'account_page']);
        add_filter('woocommerce_cart_totals_coupon_label', [$this, 'coupon_label'], 10, 2);
        add_action('wp_ajax_nabbis_redeem_points', [$this, 'redeem_points']);
    }

    public function award_points($order_id) {
        $order = wc_get_order($order_id);
        $user_id = $order->get_user_id();
        if (!$user_id) return;

        $total = $order->get_total();
        $points = round($total * self::POINTS_PER_KSH);

        $current = (int) get_user_meta($user_id, '_nabbis_loyalty_points', true);
        update_user_meta($user_id, '_nabbis_loyalty_points', $current + $points);

        $total_earned = (int) get_user_meta($user_id, '_nabbis_loyalty_total_earned', true);
        update_user_meta($user_id, '_nabbis_loyalty_total_earned', $total_earned + $points);

        $order->add_order_note(sprintf(
            __('Loyalty: %d points awarded (KSh %s spent)', 'nabbis-core'),
            $points,
            number_format($total, 2)
        ));
    }

    public function get_points($user_id = null) {
        if (!$user_id) $user_id = get_current_user_id();
        if (!$user_id) return 0;
        return (int) get_user_meta($user_id, '_nabbis_loyalty_points', true);
    }

    public function get_points_value($user_id = null) {
        $points = $this->get_points($user_id);
        return $points * self::KSH_PER_POINT_REDEEM;
    }

    public function account_page() {
        $points = $this->get_points();
        $value = $this->get_points_value();
        $total_earned = (int) get_user_meta(get_current_user_id(), '_nabbis_loyalty_total_earned', true);

        echo '<div class="nabbis-loyalty-dashboard">';
        echo '<h2>' . esc_html__('Loyalty Points', 'nabbis-core') . '</h2>';

        echo '<div class="nabbis-loyalty-summary">';
        echo '<div class="nabbis-loyalty-card">';
        echo '<span class="nabbis-loyalty-number">' . esc_html(number_format($points)) . '</span>';
        echo '<span>' . esc_html__('Available Points', 'nabbis-core') . '</span>';
        echo '</div>';
        echo '<div class="nabbis-loyalty-card">';
        echo '<span class="nabbis-loyalty-number">KSh ' . esc_html(number_format($value, 2)) . '</span>';
        echo '<span>' . esc_html__('Value to Redeem', 'nabbis-core') . '</span>';
        echo '</div>';
        echo '<div class="nabbis-loyalty-card">';
        echo '<span class="nabbis-loyalty-number">' . esc_html(number_format($total_earned)) . '</span>';
        echo '<span>' . esc_html__('Total Earned', 'nabbis-core') . '</span>';
        echo '</div>';
        echo '</div>';

        if ($points >= 500) {
            echo '<form class="nabbis-loyalty-redeem" method="post">';
            echo '<input type="number" name="redeem_points" min="500" max="' . esc_attr($points) . '" step="100" placeholder="' . esc_attr__('Points to redeem (min 500)', 'nabbis-core') . '">';
            echo '<button type="submit" class="nabbis-btn nabbis-btn-primary">' . esc_html__('Redeem as Coupon', 'nabbis-core') . '</button>';
            echo '<p class="description">' . esc_html__('500 points = KSh 50 discount. Redeemed as a coupon code applied to your cart.', 'nabbis-core') . '</p>';
            echo '</form>';
        }

        echo '<div class="nabbis-loyalty-info">';
        echo '<h3>' . esc_html__('How it works', 'nabbis-core') . '</h3>';
        echo '<ul>';
        echo '<li>' . esc_html__('Earn 1 point for every KSh 1 spent', 'nabbis-core') . '</li>';
        echo '<li>' . esc_html__('Redeem 500 points for KSh 50 discount', 'nabbis-core') . '</li>';
        echo '<li>' . esc_html__('Points are awarded when order status is "Completed"', 'nabbis-core') . '</li>';
        echo '<li>' . esc_html__('Points never expire', 'nabbis-core') . '</li>';
        echo '</ul>';
        echo '</div>';

        echo '</div>';
    }

    public function coupon_label($label, $coupon) {
        if (strpos($coupon->get_code(), 'loyalty_') === 0) {
            return __('Loyalty Points Redemption', 'nabbis-core');
        }
        return $label;
    }

    public function redeem_points() {
        check_ajax_referer('nabbis_core_nonce', 'nonce');

        $points = intval($_POST['points']);
        $user_id = get_current_user_id();

        if ($points < 500) {
            wp_send_json_error(__('Minimum 500 points required.', 'nabbis-core'));
        }

        $available = $this->get_points($user_id);
        if ($points > $available) {
            wp_send_json_error(__('Insufficient points.', 'nabbis-core'));
        }

        $discount = $points * self::KSH_PER_POINT_REDEEM;
        $coupon_code = 'loyalty_' . $user_id . '_' . time();

        $coupon = new WC_Coupon();
        $coupon->set_code($coupon_code);
        $coupon->set_discount_type('fixed_cart');
        $coupon->set_amount($discount);
        $coupon->set_individual_use(false);
        $coupon->set_usage_limit(1);
        $coupon->set_usage_limit_per_user(1);
        $coupon->set_customer_email([wp_get_current_user()->user_email]);
        $coupon->save();

        $remaining = $available - $points;
        update_user_meta($user_id, '_nabbis_loyalty_points', $remaining);

        if (WC()->cart && !WC()->cart->is_empty()) {
            WC()->cart->apply_coupon($coupon_code);
        }

        wp_send_json_success([
            'message' => sprintf(__('Coupon created: %s - KSh %s discount applied!', 'nabbis-core'), $coupon_code, number_format($discount, 2)),
            'code'    => $coupon_code,
        ]);
    }
}
