<?php
if (!defined('ABSPATH')) exit;

class Nabbis_Referrals {

    public function __construct() {
        add_action('woocommerce_order_status_completed', [$this, 'award_referral_bonus']);
        add_action('woocommerce_account_referrals_endpoint', [$this, 'account_page']);
        add_action('wp_loaded', [$this, 'track_referral']);
    }

    public function track_referral() {
        if (isset($_GET['ref']) && !is_user_logged_in()) {
            $ref_id = intval($_GET['ref']);
            if ($ref_id > 0) {
                setcookie('nabbis_referral', $ref_id, time() + DAYS_IN_SECONDS * 7, COOKIEPATH, COOKIE_DOMAIN);
                WC()->session->set('nabbis_referral', $ref_id);
            }
        }
    }

    public function get_referral_link() {
        $user_id = get_current_user_id();
        if (!$user_id) return '';
        return add_query_arg('ref', $user_id, wc_get_page_permalink('shop'));
    }

    public function award_referral_bonus($order_id) {
        $order = wc_get_order($order_id);
        $user_id = $order->get_user_id();
        if (!$user_id) return;

        $referred_by = $order->get_meta('_nabbis_referred_by');
        if ($referred_by) {
            $bonus = round($order->get_total() * 0.05);
            $current = (int) get_user_meta($referred_by, '_nabbis_loyalty_points', true);
            update_user_meta($referred_by, '_nabbis_loyalty_points', $current + $bonus);

            $referral_count = (int) get_user_meta($referred_by, '_nabbis_referral_count', true);
            update_user_meta($referred_by, '_nabbis_referral_count', $referral_count + 1);

            $order->add_order_note(sprintf(
                __('Referral bonus: %d points awarded to referrer (User #%d)', 'nabbis-core'),
                $bonus,
                $referred_by
            ));
        }

        $referral = WC()->session ? WC()->session->get('nabbis_referral') : 0;
        if ($referral && $referral !== $user_id) {
            $order->update_meta_data('_nabbis_referred_by', $referral);
            $order->save();
        }
    }

    public function account_page() {
        $user_id = get_current_user_id();
        $link = $this->get_referral_link();
        $count = (int) get_user_meta($user_id, '_nabbis_referral_count', true);
        $points = (int) get_user_meta($user_id, '_nabbis_loyalty_points', true);

        echo '<div class="nabbis-referrals-dashboard">';
        echo '<h2>' . esc_html__('Refer a Friend', 'nabbis-core') . '</h2>';

        echo '<div class="nabbis-referral-summary">';
        echo '<p>' . esc_html__('Share your referral link with friends. When they make their first purchase, you earn 5% of their order value as loyalty points!', 'nabbis-core') . '</p>';
        echo '</div>';

        echo '<div class="nabbis-referral-link-box">';
        echo '<label>' . esc_html__('Your Referral Link:', 'nabbis-core') . '</label>';
        echo '<div class="nabbis-referral-copy">';
        echo '<input type="text" value="' . esc_url($link) . '" readonly id="nabbis-referral-link">';
        echo '<button class="nabbis-btn nabbis-btn-sm nabbis-btn-primary" onclick="navigator.clipboard.writeText(document.getElementById(\'nabbis-referral-link\').value);this.textContent=\'Copied!\'">' . esc_html__('Copy', 'nabbis-core') . '</button>';
        echo '</div>';
        echo '</div>';

        echo '<div class="nabbis-loyalty-summary" style="margin-top:2rem">';
        echo '<div class="nabbis-loyalty-card">';
        echo '<span class="nabbis-loyalty-number">' . esc_html($count) . '</span>';
        echo '<span>' . esc_html__('Friends Referred', 'nabbis-core') . '</span>';
        echo '</div>';
        echo '<div class="nabbis-loyalty-card">';
        echo '<span class="nabbis-loyalty-number">' . esc_html(number_format($points)) . '</span>';
        echo '<span>' . esc_html__('Points Earned', 'nabbis-core') . '</span>';
        echo '</div>';
        echo '</div>';

        echo '<div class="nabbis-referral-share">';
        echo '<h3>' . esc_html__('Share on Social Media', 'nabbis-core') . '</h3>';
        $encoded_link = urlencode($link);
        echo '<div class="nabbis-referral-buttons">';
        echo '<a href="https://wa.me/?text=' . $encoded_link . '" target="_blank" class="nabbis-btn nabbis-btn-sm" style="background:#25D366;color:white">WhatsApp</a>';
        echo '<a href="https://www.facebook.com/sharer/sharer.php?u=' . $encoded_link . '" target="_blank" class="nabbis-btn nabbis-btn-sm" style="background:#1877F2;color:white">Facebook</a>';
        echo '<a href="https://twitter.com/intent/tweet?url=' . $encoded_link . '&text=Shop%20at%20Nabbis%20Collections!" target="_blank" class="nabbis-btn nabbis-btn-sm" style="background:#000;color:white">X (Twitter)</a>';
        echo '</div>';
        echo '</div>';

        echo '</div>';
    }
}
