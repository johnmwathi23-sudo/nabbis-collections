<?php
if (!defined('ABSPATH')) exit;

class Nabbis_MPesa_Admin {

    public function __construct() {
        add_action('add_meta_boxes', [$this, 'add_order_metabox']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'admin_scripts']);
    }

    public function add_order_metabox() {
        add_meta_box(
            'nabbis_mpesa_order',
            __('M-Pesa Payment Details', 'nabbis-mpesa'),
            [$this, 'render_order_metabox'],
            'shop_order',
            'side',
            'default'
        );
    }

    public function render_order_metabox($post) {
        $order = wc_get_order($post->ID);
        if (!$order) return;

        $phone = $order->get_meta('_nabbis_mpesa_phone');
        $receipt = $order->get_meta('_nabbis_mpesa_receipt');
        $checkout_id = $order->get_meta('_nabbis_mpesa_checkout_request_id');
        $transaction_date = $order->get_meta('_nabbis_mpesa_transaction_date');

        echo '<div class="nabbis-mpesa-metabox">';
        echo '<p><strong>' . __('Phone:', 'nabbis-mpesa') . '</strong><br>' . esc_html($phone ?: '—') . '</p>';
        echo '<p><strong>' . __('Receipt:', 'nabbis-mpesa') . '</strong><br>' . esc_html($receipt ?: '—') . '</p>';
        echo '<p><strong>' . __('Checkout ID:', 'nabbis-mpesa') . '</strong><br><code>' . esc_html($checkout_id ?: '—') . '</code></p>';
        echo '<p><strong>' . __('Transaction Date:', 'nabbis-mpesa') . '</strong><br>' . esc_html($transaction_date ?: '—') . '</p>';

        if ($receipt) {
            echo '<p style="color:var(--nabbis-success);font-weight:600;">✅ ' . __('Payment Confirmed', 'nabbis-mpesa') . '</p>';
        } else {
            echo '<p style="color:var(--nabbis-warning);">⏳ ' . __('Awaiting payment confirmation', 'nabbis-mpesa') . '</p>';
        }
        echo '</div>';
    }

    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            __('M-Pesa Transactions', 'nabbis-mpesa'),
            __('M-Pesa Logs', 'nabbis-mpesa'),
            'manage_woocommerce',
            'nabbis-mpesa-logs',
            [$this, 'render_logs_page']
        );
    }

    public function render_logs_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_mpesa_transactions';
        $per_page = 20;
        $page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $offset = ($page - 1) * $per_page;
        $total = $wpdb->get_var("SELECT COUNT(*) FROM $table");
        $total_pages = ceil($total / $per_page);

        $transactions = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $per_page,
            $offset
        ));

        ?>
        <div class="wrap">
            <h1><?php esc_html_e('M-Pesa Transaction Logs', 'nabbis-mpesa'); ?></h1>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th><?php esc_html_e('ID', 'nabbis-mpesa'); ?></th>
                        <th><?php esc_html_e('Order', 'nabbis-mpesa'); ?></th>
                        <th><?php esc_html_e('Phone', 'nabbis-mpesa'); ?></th>
                        <th><?php esc_html_e('Amount', 'nabbis-mpesa'); ?></th>
                        <th><?php esc_html_e('Receipt', 'nabbis-mpesa'); ?></th>
                        <th><?php esc_html_e('Status', 'nabbis-mpesa'); ?></th>
                        <th><?php esc_html_e('Date', 'nabbis-mpesa'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($transactions): ?>
                        <?php foreach ($transactions as $t): ?>
                            <tr>
                                <td><?php echo esc_html($t->id); ?></td>
                                <td>
                                    <?php if ($t->order_id): ?>
                                        <a href="<?php echo esc_url(get_edit_post_link($t->order_id)); ?>">
                                            #<?php echo esc_html($t->order_id); ?>
                                        </a>
                                    <?php else: ?>
                                        —
                                    <?php endif; ?>
                                </td>
                                <td><?php echo esc_html($t->phone_number ?: '—'); ?></td>
                                <td><?php echo $t->amount ? 'KSh ' . esc_html(number_format($t->amount, 2)) : '—'; ?></td>
                                <td><?php echo esc_html($t->mpesa_receipt ?: '—'); ?></td>
                                <td>
                                    <?php
                                    $status_class = match ($t->status) {
                                        'completed' => 'status-completed',
                                        'failed'    => 'status-failed',
                                        default     => 'status-pending',
                                    };
                                    ?>
                                    <span class="nabbis-status <?php echo esc_attr($status_class); ?>">
                                        <?php echo esc_html(ucfirst($t->status)); ?>
                                    </span>
                                </td>
                                <td><?php echo esc_html($t->created_at); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr><td colspan="7"><?php esc_html_e('No transactions yet.', 'nabbis-mpesa'); ?></td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
            <?php if ($total_pages > 1): ?>
                <div class="tablenav">
                    <div class="tablenav-pages">
                        <?php
                        echo paginate_links([
                            'base'    => add_query_arg('paged', '%#%'),
                            'format'  => '',
                            'current' => $page,
                            'total'   => $total_pages,
                        ]);
                        ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        <style>
            .nabbis-status { padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
            .nabbis-status.status-completed { background: #d1fae5; color: #065f46; }
            .nabbis-status.status-failed { background: #fee2e2; color: #991b1b; }
            .nabbis-status.status-pending { background: #fef3c7; color: #92400e; }
        </style>
        <?php
    }

    public function admin_scripts($hook) {
        if ($hook === 'woocommerce_page_nabbis-mpesa-logs') {
            // Styles are inline in the render method
        }
    }
}

new Nabbis_MPesa_Admin();
