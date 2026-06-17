<?php
if (!defined('ABSPATH')) exit;

class Nabbis_Compare {

    public function __construct() {
        add_action('wp_ajax_nabbis_toggle_compare', [$this, 'toggle_compare']);
        add_action('wp_ajax_nopriv_nabbis_toggle_compare', [$this, 'toggle_compare']);
        add_action('woocommerce_after_add_to_cart_button', [$this, 'add_to_product_page']);
        add_action('woocommerce_account_compare_endpoint', [$this, 'account_page']);
        add_action('init', [$this, 'register_compare_shortcode']);
    }

    public function toggle_compare() {
        check_ajax_referer('nabbis_core_nonce', 'nonce');

        $product_id = intval($_POST['product_id']);
        if (!$product_id) {
            wp_send_json_error('Invalid product');
        }

        $compare = WC()->session ? WC()->session->get('nabbis_compare', []) : [];

        if (in_array($product_id, $compare)) {
            $compare = array_diff($compare, [$product_id]);
            $action = 'removed';
        } else {
            if (count($compare) >= 4) {
                wp_send_json_error(__('Maximum 4 products can be compared at once.', 'nabbis-core'));
            }
            $compare[] = $product_id;
            $action = 'added';
        }

        if (WC()->session) {
            WC()->session->set('nabbis_compare', $compare);
        }

        wp_send_json_success([
            'action'  => $action,
            'count'   => count($compare),
            'message' => $action === 'added' ? __('Added to comparison!', 'nabbis-core') : __('Removed from comparison.', 'nabbis-core'),
        ]);
    }

    public function add_to_product_page() {
        global $product;
        if (!$product) return;

        $compare = WC()->session ? WC()->session->get('nabbis_compare', []) : [];
        $in_compare = in_array($product->get_id(), $compare);

        echo '<button type="button" class="nabbis-compare-btn ' . ($in_compare ? 'active' : '') . '" data-product-id="' . esc_attr($product->get_id()) . '" aria-label="' . __('Compare', 'nabbis-core') . '">';
        echo '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        echo '<span>' . __('Compare', 'nabbis-core') . '</span>';
        echo '</button>';
    }

    public function account_page() {
        $compare = WC()->session ? WC()->session->get('nabbis_compare', []) : [];

        echo '<h2>' . esc_html__('Product Comparison', 'nabbis-core') . '</h2>';

        if (empty($compare)) {
            echo '<p>' . esc_html__('No products to compare. Add products to comparison from product pages.', 'nabbis-core') . '</p>';
            echo '<p><a href="' . esc_url(wc_get_page_permalink('shop')) . '" class="nabbis-btn nabbis-btn-primary">' . esc_html__('Browse Products', 'nabbis-core') . '</a></p>';
            return;
        }

        $products = [];
        foreach ($compare as $id) {
            $product = wc_get_product($id);
            if ($product) $products[] = $product;
        }

        if (empty($products)) {
            echo '<p>' . esc_html__('No valid products to compare.', 'nabbis-core') . '</p>';
            return;
        }

        echo '<div class="nabbis-compare-table-wrap">';
        echo '<table class="nabbis-compare-table">';
        echo '<thead><tr><th>' . esc_html__('Feature', 'nabbis-core') . '</th>';
        foreach ($products as $product) {
            echo '<th><a href="' . esc_url($product->get_permalink()) . '">' . $product->get_image('thumbnail') . '<br>' . esc_html($product->get_name()) . '</a></th>';
        }
        echo '</tr></thead>';
        echo '<tbody>';

        echo '<tr><td>' . esc_html__('Price', 'nabbis-core') . '</td>';
        foreach ($products as $product) {
            echo '<td>' . $product->get_price_html() . '</td>';
        }
        echo '</tr>';

        echo '<tr><td>' . esc_html__('Rating', 'nabbis-core') . '</td>';
        foreach ($products as $product) {
            echo '<td>' . wc_get_rating_html($product->get_average_rating()) . '</td>';
        }
        echo '</tr>';

        echo '<tr><td>' . esc_html__('Description', 'nabbis-core') . '</td>';
        foreach ($products as $product) {
            echo '<td>' . wp_trim_words($product->get_short_description(), 20) . '</td>';
        }
        echo '</tr>';

        if ($products[0]->is_type('variable')) {
            echo '<tr><td>' . esc_html__('Available Sizes', 'nabbis-core') . '</td>';
            foreach ($products as $product) {
                $sizes = $product->get_variation_attributes();
                echo '<td>' . esc_html(implode(', ', array_shift($sizes) ?: [])) . '</td>';
            }
            echo '</tr>';
        }

        echo '<tr><td>' . esc_html__('Action', 'nabbis-core') . '</td>';
        foreach ($products as $product) {
            echo '<td><a href="' . esc_url($product->add_to_cart_url()) . '" class="nabbis-btn nabbis-btn-sm nabbis-btn-primary">' . esc_html($product->add_to_cart_text()) . '</a></td>';
        }
        echo '</tr>';

        echo '</tbody></table>';
        echo '</div>';

        echo '<p><a href="#" class="nabbis-compare-clear" data-nonce="' . wp_create_nonce('nabbis_core_nonce') . '">' . esc_html__('Clear All', 'nabbis-core') . '</a></p>';
    }

    public function register_compare_shortcode() {
        add_shortcode('nabbis_compare', [$this, 'account_page']);
    }
}
