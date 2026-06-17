<?php
if (!defined('ABSPATH')) exit;

class Nabbis_Wishlist {

    public function __construct() {
        add_action('wp_ajax_nabbis_toggle_wishlist', [$this, 'toggle_wishlist']);
        add_action('wp_ajax_nopriv_nabbis_toggle_wishlist', [$this, 'toggle_wishlist']);
        add_action('woocommerce_after_add_to_cart_button', [$this, 'add_to_product_page']);
        add_action('woocommerce_before_shop_loop_item', [$this, 'add_to_loop'], 5);
        add_action('woocommerce_account_wishlist_endpoint', [$this, 'account_page']);
        add_filter('woocommerce_account_menu_item_classes', [$this, 'menu_classes'], 10, 2);
    }

    public function toggle_wishlist() {
        check_ajax_referer('nabbis_core_nonce', 'nonce');

        $product_id = intval($_POST['product_id']);
        $user_id = get_current_user_id();

        if (!$product_id || !$user_id) {
            wp_send_json_error('Invalid request');
        }

        $wishlist = get_user_meta($user_id, '_nabbis_wishlist', true) ?: [];

        if (in_array($product_id, $wishlist)) {
            $wishlist = array_diff($wishlist, [$product_id]);
            $action = 'removed';
        } else {
            $wishlist[] = $product_id;
            $action = 'added';
        }

        update_user_meta($user_id, '_nabbis_wishlist', $wishlist);

        wp_send_json_success([
            'action'  => $action,
            'count'   => count($wishlist),
            'message' => $action === 'added' ? __('Added to wishlist!', 'nabbis-core') : __('Removed from wishlist.', 'nabbis-core'),
        ]);
    }

    public function add_to_product_page() {
        global $product;
        if (!$product) return;

        $in_wishlist = $this->is_in_wishlist($product->get_id());
        echo '<button type="button" class="nabbis-wishlist-btn ' . ($in_wishlist ? 'active' : '') . '" data-product-id="' . esc_attr($product->get_id()) . '" aria-label="' . __('Add to wishlist', 'nabbis-core') . '">';
        echo '<svg width="20" height="20" viewBox="0 0 24 24" fill="' . ($in_wishlist ? 'currentColor' : 'none') . '" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        echo '</button>';
    }

    public function add_to_loop() {
        global $product;
        if (!$product) return;

        $in_wishlist = $this->is_in_wishlist($product->get_id());
        echo '<button type="button" class="nabbis-wishlist-btn nabbis-wishlist-loop ' . ($in_wishlist ? 'active' : '') . '" data-product-id="' . esc_attr($product->get_id()) . '" aria-label="' . __('Add to wishlist', 'nabbis-core') . '">';
        echo '<svg width="16" height="16" viewBox="0 0 24 24" fill="' . ($in_wishlist ? 'currentColor' : 'none') . '" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        echo '</button>';
    }

    public function account_page() {
        $user_id = get_current_user_id();
        $wishlist = get_user_meta($user_id, '_nabbis_wishlist', true) ?: [];

        echo '<h2>' . esc_html__('My Wishlist', 'nabbis-core') . '</h2>';

        if (empty($wishlist)) {
            echo '<p>' . esc_html__('Your wishlist is empty.', 'nabbis-core') . '</p>';
            echo '<p><a href="' . esc_url(wc_get_page_permalink('shop')) . '" class="nabbis-btn nabbis-btn-primary">' . esc_html__('Browse Products', 'nabbis-core') . '</a></p>';
            return;
        }

        echo '<div class="nabbis-products-grid">';
        foreach ($wishlist as $product_id) {
            $product = wc_get_product($product_id);
            if (!$product) continue;

            wc_get_template_part('content', 'product');
        }
        echo '</div>';
    }

    public function menu_classes($classes, $endpoint) {
        if ($endpoint === 'wishlist') {
            $user_id = get_current_user_id();
            $count = count(get_user_meta($user_id, '_nabbis_wishlist', true) ?: []);
            if ($count) {
                $classes[] = 'has-count';
            }
        }
        return $classes;
    }

    private function is_in_wishlist($product_id) {
        $user_id = get_current_user_id();
        if (!$user_id) return false;
        $wishlist = get_user_meta($user_id, '_nabbis_wishlist', true) ?: [];
        return in_array($product_id, $wishlist);
    }
}
