<?php
if (!defined('ABSPATH')) exit;

class Nabbis_Delivery_Admin {

    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_post_nabbis_save_delivery_zone', [$this, 'save_zone']);
        add_action('admin_post_nabbis_delete_delivery_zone', [$this, 'delete_zone']);
        add_action('add_meta_boxes', [$this, 'add_order_metabox']);
        add_action('save_post_shop_order', [$this, 'save_order_meta']);
    }

    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            __('Delivery Zones', 'nabbis-delivery'),
            __('Delivery Zones', 'nabbis-delivery'),
            'manage_woocommerce',
            'nabbis-delivery-zones',
            [$this, 'render_admin_page']
        );
    }

    public function render_admin_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_delivery_zones';
        $zones = $wpdb->get_results("SELECT * FROM $table ORDER BY sort_order ASC");
        $editing = isset($_GET['edit']) ? intval($_GET['edit']) : 0;
        $edit_zone = $editing ? $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id = %d", $editing)) : null;

        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Delivery Zones', 'nabbis-delivery'); ?></h1>

            <h2><?php echo $edit_zone ? __('Edit Zone', 'nabbis-delivery') : __('Add New Zone', 'nabbis-delivery'); ?></h2>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="nabbis_save_delivery_zone">
                <?php wp_nonce_field('nabbis_delivery_nonce'); ?>
                <?php if ($edit_zone): ?>
                    <input type="hidden" name="zone_id" value="<?php echo esc_attr($edit_zone->id); ?>">
                <?php endif; ?>

                <table class="form-table">
                    <tr>
                        <th><label for="zone_name"><?php esc_html_e('Zone Name', 'nabbis-delivery'); ?></label></th>
                        <td><input type="text" name="zone_name" id="zone_name" class="regular-text" value="<?php echo $edit_zone ? esc_attr($edit_zone->zone_name) : ''; ?>" required></td>
                    </tr>
                    <tr>
                        <th><label for="counties"><?php esc_html_e('Counties (comma-separated)', 'nabbis-delivery'); ?></label></th>
                        <td>
                            <input type="text" name="counties" id="counties" class="regular-text" value="<?php echo $edit_zone ? esc_attr($edit_zone->counties) : ''; ?>">
                            <p class="description"><?php esc_html_e('e.g., Nairobi,Kiambu,Kajiado', 'nabbis-delivery'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="base_rate"><?php esc_html_e('Base Rate (KSh)', 'nabbis-delivery'); ?></label></th>
                        <td><input type="number" name="base_rate" id="base_rate" step="0.01" min="0" value="<?php echo $edit_zone ? esc_attr($edit_zone->base_rate) : '0'; ?>" required></td>
                    </tr>
                    <tr>
                        <th><label for="per_kg_rate"><?php esc_html_e('Per KG Rate (KSh)', 'nabbis-delivery'); ?></label></th>
                        <td><input type="number" name="per_kg_rate" id="per_kg_rate" step="0.01" min="0" value="<?php echo $edit_zone ? esc_attr($edit_zone->per_kg_rate) : '0'; ?>" required></td>
                    </tr>
                    <tr>
                        <th><label for="free_threshold"><?php esc_html_e('Free Delivery Threshold (KSh)', 'nabbis-delivery'); ?></label></th>
                        <td><input type="number" name="free_threshold" id="free_threshold" step="0.01" min="0" value="<?php echo $edit_zone ? esc_attr($edit_zone->free_threshold) : ''; ?>">
                            <p class="description"><?php esc_html_e('Leave empty for no free delivery.', 'nabbis-delivery'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="eta_min"><?php esc_html_e('ETA Min (days)', 'nabbis-delivery'); ?></label></th>
                        <td><input type="number" name="eta_min" id="eta_min" min="0" value="<?php echo $edit_zone ? esc_attr($edit_zone->eta_min) : ''; ?>"></td>
                    </tr>
                    <tr>
                        <th><label for="eta_max"><?php esc_html_e('ETA Max (days)', 'nabbis-delivery'); ?></label></th>
                        <td><input type="number" name="eta_max" id="eta_max" min="0" value="<?php echo $edit_zone ? esc_attr($edit_zone->eta_max) : ''; ?>"></td>
                    </tr>
                    <tr>
                        <th><label for="sort_order"><?php esc_html_e('Sort Order', 'nabbis-delivery'); ?></label></th>
                        <td><input type="number" name="sort_order" id="sort_order" min="0" value="<?php echo $edit_zone ? esc_attr($edit_zone->sort_order) : '0'; ?>"></td>
                    </tr>
                    <tr>
                        <th><?php esc_html_e('Active', 'nabbis-delivery'); ?></th>
                        <td><label><input type="checkbox" name="is_active" value="1" <?php checked($edit_zone ? $edit_zone->is_active : 1, 1); ?>> <?php esc_html_e('Enable this zone', 'nabbis-delivery'); ?></label></td>
                    </tr>
                </table>
                <p class="submit">
                    <button type="submit" class="button button-primary"><?php echo $edit_zone ? __('Update Zone', 'nabbis-delivery') : __('Add Zone', 'nabbis-delivery'); ?></button>
                    <?php if ($edit_zone): ?>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=nabbis-delivery-zones')); ?>" class="button"><?php esc_html_e('Cancel', 'nabbis-delivery'); ?></a>
                    <?php endif; ?>
                </p>
            </form>

            <h2><?php esc_html_e('Existing Zones', 'nabbis-delivery'); ?></h2>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Name', 'nabbis-delivery'); ?></th>
                        <th><?php esc_html_e('Counties', 'nabbis-delivery'); ?></th>
                        <th><?php esc_html_e('Base Rate', 'nabbis-delivery'); ?></th>
                        <th><?php esc_html_e('Per KG', 'nabbis-delivery'); ?></th>
                        <th><?php esc_html_e('Free Threshold', 'nabbis-delivery'); ?></th>
                        <th><?php esc_html_e('ETA', 'nabbis-delivery'); ?></th>
                        <th><?php esc_html_e('Active', 'nabbis-delivery'); ?></th>
                        <th><?php esc_html_e('Actions', 'nabbis-delivery'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($zones as $zone): ?>
                        <tr>
                            <td><?php echo esc_html($zone->zone_name); ?></td>
                            <td><?php echo esc_html($zone->counties ?: '—'); ?></td>
                            <td>KSh <?php echo esc_html(number_format($zone->base_rate, 2)); ?></td>
                            <td>KSh <?php echo esc_html(number_format($zone->per_kg_rate, 2)); ?></td>
                            <td><?php echo $zone->free_threshold ? 'KSh ' . esc_html(number_format($zone->free_threshold, 0)) : '—'; ?></td>
                            <td><?php echo $zone->eta_min !== null ? esc_html($zone->eta_min . '-' . $zone->eta_max . ' days') : '—'; ?></td>
                            <td><?php echo $zone->is_active ? '✅' : '❌'; ?></td>
                            <td>
                                <a href="<?php echo esc_url(admin_url('admin.php?page=nabbis-delivery-zones&edit=' . $zone->id)); ?>" class="button button-small"><?php esc_html_e('Edit', 'nabbis-delivery'); ?></a>
                                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display:inline;">
                                    <input type="hidden" name="action" value="nabbis_delete_delivery_zone">
                                    <input type="hidden" name="zone_id" value="<?php echo esc_attr($zone->id); ?>">
                                    <?php wp_nonce_field('nabbis_delivery_nonce'); ?>
                                    <button type="submit" class="button button-small" onclick="return confirm('<?php esc_attr_e('Delete this zone?', 'nabbis-delivery'); ?>')"><?php esc_html_e('Delete', 'nabbis-delivery'); ?></button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function save_zone() {
        if (!wp_verify_nonce($_POST['_wpnonce'], 'nabbis_delivery_nonce')) {
            wp_die('Invalid nonce');
        }
        if (!current_user_can('manage_woocommerce')) {
            wp_die('Unauthorized');
        }

        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_delivery_zones';
        $data = [
            'zone_name'      => sanitize_text_field($_POST['zone_name']),
            'counties'       => sanitize_text_field($_POST['counties'] ?? ''),
            'base_rate'      => floatval($_POST['base_rate']),
            'per_kg_rate'    => floatval($_POST['per_kg_rate']),
            'free_threshold' => !empty($_POST['free_threshold']) ? floatval($_POST['free_threshold']) : null,
            'eta_min'        => !empty($_POST['eta_min']) ? intval($_POST['eta_min']) : null,
            'eta_max'        => !empty($_POST['eta_max']) ? intval($_POST['eta_max']) : null,
            'sort_order'     => intval($_POST['sort_order']),
            'is_active'      => isset($_POST['is_active']) ? 1 : 0,
        ];

        if (!empty($_POST['zone_id'])) {
            $wpdb->update($table, $data, ['id' => intval($_POST['zone_id'])]);
        } else {
            $wpdb->insert($table, $data);
        }

        wp_redirect(admin_url('admin.php?page=nabbis-delivery-zones&message=saved'));
        exit;
    }

    public function delete_zone() {
        if (!wp_verify_nonce($_POST['_wpnonce'], 'nabbis_delivery_nonce')) {
            wp_die('Invalid nonce');
        }
        if (!current_user_can('manage_woocommerce')) {
            wp_die('Unauthorized');
        }

        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_delivery_zones';
        $wpdb->delete($table, ['id' => intval($_POST['zone_id'])]);

        wp_redirect(admin_url('admin.php?page=nabbis-delivery-zones&message=deleted'));
        exit;
    }

    public function add_order_metabox() {
        add_meta_box(
            'nabbis_delivery_order',
            __('Delivery Details', 'nabbis-delivery'),
            [$this, 'render_order_metabox'],
            'shop_order',
            'side',
            'default'
        );
    }

    public function render_order_metabox($post) {
        $order = wc_get_order($post->ID);
        if (!$order) return;

        $tracking = $order->get_meta('_nabbis_delivery_tracking_number');
        $courier = $order->get_meta('_nabbis_delivery_courier');
        $eta = $order->get_meta('_nabbis_delivery_eta');

        wp_nonce_field('nabbis_delivery_meta', 'nabbis_delivery_nonce');
        ?>
        <p>
            <label for="nabbis_courier"><?php esc_html_e('Courier:', 'nabbis-delivery'); ?></label>
            <input type="text" id="nabbis_courier" name="nabbis_delivery_courier" value="<?php echo esc_attr($courier); ?>" class="widefat">
        </p>
        <p>
            <label for="nabbis_tracking"><?php esc_html_e('Tracking Number:', 'nabbis-delivery'); ?></label>
            <input type="text" id="nabbis_tracking" name="nabbis_delivery_tracking" value="<?php echo esc_attr($tracking); ?>" class="widefat">
        </p>
        <p>
            <label for="nabbis_eta"><?php esc_html_e('Estimated Delivery:', 'nabbis-delivery'); ?></label>
            <input type="text" id="nabbis_eta" name="nabbis_delivery_eta" value="<?php echo esc_attr($eta); ?>" class="widefat" placeholder="e.g., 2-3 days">
        </p>
        <?php
    }

    public function save_order_meta($post_id) {
        if (!isset($_POST['nabbis_delivery_nonce']) || !wp_verify_nonce($_POST['nabbis_delivery_nonce'], 'nabbis_delivery_meta')) {
            return;
        }
        if (!current_user_can('edit_shop_orders')) {
            return;
        }

        $order = wc_get_order($post_id);
        if (!$order) return;

        if (isset($_POST['nabbis_delivery_courier'])) {
            $order->update_meta_data('_nabbis_delivery_courier', sanitize_text_field($_POST['nabbis_delivery_courier']));
        }
        if (isset($_POST['nabbis_delivery_tracking'])) {
            $order->update_meta_data('_nabbis_delivery_tracking_number', sanitize_text_field($_POST['nabbis_delivery_tracking']));
        }
        if (isset($_POST['nabbis_delivery_eta'])) {
            $order->update_meta_data('_nabbis_delivery_eta', sanitize_text_field($_POST['nabbis_delivery_eta']));
        }
        $order->save();
    }
}
