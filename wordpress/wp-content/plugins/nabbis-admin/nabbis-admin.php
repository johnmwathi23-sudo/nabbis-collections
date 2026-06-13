<?php
/**
 * Plugin Name: Nabbis Admin Enhancements
 * Description: Admin dashboard customizations for Nabbis Collections.
 * Version: 1.0.0
 * Author: Nabbis Collections
 */

if (!defined('ABSPATH')) exit;

class Nabbis_Admin {

    public function __construct() {
        add_action('admin_enqueue_scripts', [$this, 'admin_styles']);
        add_action('admin_head', [$this, 'admin_head_css']);
        add_action('admin_footer', [$this, 'admin_footer_js']);
        add_filter('admin_footer_text', [$this, 'admin_footer_text']);
        add_filter('update_footer', [$this, 'admin_footer_version'], 11);
        add_action('admin_menu', [$this, 'remove_dashboard_widgets'], 99);
        add_filter('woocommerce_dashboard_status_widget_top_seller', '__return_false');
        add_action('wp_dashboard_setup', [$this, 'add_dashboard_widgets']);
    }

    public function admin_styles() {
        wp_add_inline_style('wp-admin', '
            #adminmenu .toplevel_page_nabbis-settings .wp-menu-image { color: #C4B5FD !important; }
            #adminmenu .toplevel_page_nabbis-settings:hover .wp-menu-image { color: #DDD6FE !important; }
            .woocommerce_page_wc-orders .tablenav .actions { padding: 2px 0; }
            .nabbis-admin-dash { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
            .nabbis-admin-dash .postbox { margin: 0; }
        ');
    }

    public function admin_head_css() {
        echo '<style>
            body.admin-color-fresh #adminmenu .toplevel_page_nabbis-settings .wp-menu-image img { opacity: 0.8; }
        </style>';
    }

    public function admin_footer_js() {
        ?>
        <script>
        jQuery(function($) {
            if (typeof wcTracks === 'undefined') {
                // Silence is golden
            }
        });
        </script>
        <?php
    }

    public function admin_footer_text() {
        return 'Nabbis Collections v' . NABBIS_CORE_VERSION . ' | <a href="https://nabbiscollections.co.ke" target="_blank">nabbiscollections.co.ke</a>';
    }

    public function admin_footer_version() {
        global $wp_version;
        return 'WP ' . $wp_version . ' | WooCommerce ' . (defined('WC_VERSION') ? WC_VERSION : '—');
    }

    public function remove_dashboard_widgets() {
        remove_meta_box('dashboard_quick_press', 'dashboard', 'side');
        remove_meta_box('dashboard_primary', 'dashboard', 'side');
        remove_meta_box('dashboard_secondary', 'dashboard', 'side');
        remove_meta_box('dashboard_activity', 'dashboard', 'normal');
    }

    public function add_dashboard_widgets() {
        wp_add_dashboard_widget(
            'nabbis_dashboard_summary',
            __('Nabbis Collections - Overview', 'nabbis-core'),
            [$this, 'render_dashboard_widget']
        );
    }

    public function render_dashboard_widget() {
        if (!class_exists('WooCommerce')) {
            echo '<p>' . __('WooCommerce is not active.', 'nabbis-core') . '</p>';
            return;
        }

        $today = date('Y-m-d');
        $month_start = date('Y-m-01');

        $today_orders = wc_get_orders(['date_created' => $today, 'limit' => -1, 'return' => 'ids']);
        $monthly_orders = wc_get_orders(['date_created' => '>' . $month_start, 'limit' => -1, 'return' => 'ids']);

        $today_revenue = 0;
        foreach ($today_orders as $id) {
            $o = wc_get_order($id);
            if ($o) $today_revenue += $o->get_total();
        }

        $monthly_revenue = 0;
        foreach ($monthly_orders as $id) {
            $o = wc_get_order($id);
            if ($o) $monthly_revenue += $o->get_total();
        }

        $products = wp_count_posts('product');
        $published = $products->publish ?? 0;

        $user_count = count_users();
        $customers = $user_count['avail_roles']['customer'] ?? 0;

        echo '<div class="nabbis-admin-dash">';
        echo '<div class="postbox"><div class="inside"><h3>Today</h3>';
        echo '<p>' . count($today_orders) . ' orders | KSh ' . number_format($today_revenue, 2) . '</p></div></div>';
        echo '<div class="postbox"><div class="inside"><h3>This Month</h3>';
        echo '<p>' . count($monthly_orders) . ' orders | KSh ' . number_format($monthly_revenue, 2) . '</p></div></div>';
        echo '<div class="postbox"><div class="inside"><h3>Products</h3>';
        echo '<p>' . $published . ' published</p></div></div>';
        echo '<div class="postbox"><div class="inside"><h3>Customers</h3>';
        echo '<p>' . $customers . ' registered</p></div></div>';
        echo '</div>';

        $low_stock = wc_get_products(['status' => 'publish', 'stock_status' => 'lowstock', 'limit' => 5]);
        if (!empty($low_stock)) {
            echo '<h3 style="margin-top:1rem;color:#D97706;">⚠️ Low Stock Alert</h3>';
            echo '<ul>';
            foreach ($low_stock as $product) {
                echo '<li>' . esc_html($product->get_name()) . ' - Stock: ' . $product->get_stock_quantity() . '</li>';
            }
            echo '</ul>';
        }
    }
}

new Nabbis_Admin();
