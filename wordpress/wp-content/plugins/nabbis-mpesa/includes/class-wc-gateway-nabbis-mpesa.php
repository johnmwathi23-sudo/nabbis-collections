<?php
if (!defined('ABSPATH')) exit;

class WC_Gateway_Nabbis_MPesa extends WC_Payment_Gateway {

    public function __construct() {
        $this->id = 'nabbis_mpesa';
        $this->icon = apply_filters('nabbis_mpesa_icon', NABBIS_MPESA_URL . 'assets/mpesa-icon.svg');
        $this->has_fields = true;
        $this->method_title = __('M-Pesa (Nabbis)', 'nabbis-mpesa');
        $this->method_description = __('Accept payments via M-Pesa STK Push, Paybill, and Till Number.', 'nabbis-mpesa');
        $this->supports = ['products', 'refunds'];

        $this->init_form_fields();
        $this->init_settings();

        $this->title = $this->get_option('title', __('M-Pesa', 'nabbis-mpesa'));
        $this->description = $this->get_option('description', __('Pay securely using M-Pesa. Enter your M-Pesa registered phone number and you will receive an STK Push prompt.', 'nabbis-mpesa'));
        $this->enabled = $this->get_option('enabled', 'yes');

        $this->consumer_key = $this->get_option('consumer_key');
        $this->consumer_secret = $this->get_option('consumer_secret');
        $this->passkey = $this->get_option('passkey');
        $this->shortcode = $this->get_option('shortcode', '174379');
        $this->environment = $this->get_option('environment', 'sandbox');
        $this->payment_type = $this->get_option('payment_type', 'stk_push');

        add_action('woocommerce_update_options_payment_gateways_' . $this->id, [$this, 'process_admin_options']);
        add_action('woocommerce_api_nabbis_mpesa_callback', [$this, 'handle_callback']);
        add_action('woocommerce_thankyou_' . $this->id, [$this, 'thankyou_page']);

        if ($this->environment === 'sandbox') {
            $this->api_url = 'https://sandbox.safaricom.co.ke';
        } else {
            $this->api_url = 'https://api.safaricom.co.ke';
        }
    }

    public function init_form_fields() {
        $this->form_fields = [
            'enabled' => [
                'title'   => __('Enable/Disable', 'nabbis-mpesa'),
                'type'    => 'checkbox',
                'label'   => __('Enable M-Pesa Payment', 'nabbis-mpesa'),
                'default' => 'yes',
            ],
            'title' => [
                'title'       => __('Title', 'nabbis-mpesa'),
                'type'        => 'text',
                'description' => __('Payment method title visible to customers.', 'nabbis-mpesa'),
                'default'     => __('M-Pesa', 'nabbis-mpesa'),
            ],
            'description' => [
                'title'       => __('Description', 'nabbis-mpesa'),
                'type'        => 'textarea',
                'description' => __('Payment method description visible to customers.', 'nabbis-mpesa'),
                'default'     => __('Pay securely using M-Pesa. Enter your M-Pesa registered phone number and you will receive an STK Push prompt.', 'nabbis-mpesa'),
            ],
            'environment' => [
                'title'       => __('Environment', 'nabbis-mpesa'),
                'type'        => 'select',
                'options'     => ['sandbox' => __('Sandbox', 'nabbis-mpesa'), 'production' => __('Production', 'nabbis-mpesa')],
                'default'     => 'sandbox',
            ],
            'consumer_key' => [
                'title'       => __('Consumer Key', 'nabbis-mpesa'),
                'type'        => 'text',
                'description' => __('Safaricom Daraja API Consumer Key.', 'nabbis-mpesa'),
            ],
            'consumer_secret' => [
                'title'       => __('Consumer Secret', 'nabbis-mpesa'),
                'type'        => 'password',
                'description' => __('Safaricom Daraja API Consumer Secret.', 'nabbis-mpesa'),
            ],
            'passkey' => [
                'title'       => __('Passkey', 'nabbis-mpesa'),
                'type'        => 'password',
                'description' => __('Safaricom Daraja API Passkey (for STK Push).', 'nabbis-mpesa'),
            ],
            'shortcode' => [
                'title'       => __('Shortcode / Paybill', 'nabbis-mpesa'),
                'type'        => 'text',
                'description' => __('Safaricom Paybill or Till Number.', 'nabbis-mpesa'),
                'default'     => '174379',
            ],
            'payment_type' => [
                'title'       => __('Payment Type', 'nabbis-mpesa'),
                'type'        => 'select',
                'options'     => [
                    'stk_push'  => __('STK Push (Recommended)', 'nabbis-mpesa'),
                    'paybill'   => __('Paybill', 'nabbis-mpesa'),
                    'till'      => __('Till Number', 'nabbis-mpesa'),
                ],
                'default'     => 'stk_push',
            ],
        ];
    }

    public function payment_fields() {
        if ($this->description) {
            echo wpautop(wp_kses_post($this->description));
        }
        ?>
        <div class="nabbis-mpesa-payment-fields">
            <p class="form-row form-row-wide">
                <label for="nabbis-mpesa-phone"><?php esc_html_e('M-Pesa Phone Number', 'nabbis-mpesa'); ?> <span class="required">*</span></label>
                <input type="tel" id="nabbis-mpesa-phone" name="nabbis_mpesa_phone" class="input-text" placeholder="254712345678" autocomplete="tel" required />
                <span class="description"><?php esc_html_e('Enter your M-Pesa registered phone number (e.g., 254712345678)', 'nabbis-mpesa'); ?></span>
            </p>
        </div>
        <?php
    }

    public function validate_fields() {
        $phone = isset($_POST['nabbis_mpesa_phone']) ? sanitize_text_field($_POST['nabbis_mpesa_phone']) : '';
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (empty($phone)) {
            wc_add_notice(__('Please enter your M-Pesa phone number.', 'nabbis-mpesa'), 'error');
            return false;
        }

        if (strlen($phone) < 10 || strlen($phone) > 13) {
            wc_add_notice(__('Please enter a valid M-Pesa phone number (e.g., 254712345678).', 'nabbis-mpesa'), 'error');
            return false;
        }

        if (substr($phone, 0, 1) === '0') {
            $phone = '254' . substr($phone, 1);
        } elseif (substr($phone, 0, 1) !== '2') {
            $phone = '254' . $phone;
        }

        $_POST['nabbis_mpesa_phone'] = $phone;
        return true;
    }

    public function process_payment($order_id) {
        $order = wc_get_order($order_id);
        $phone = isset($_POST['nabbis_mpesa_phone']) ? sanitize_text_field($_POST['nabbis_mpesa_phone']) : '';
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (substr($phone, 0, 1) === '0') {
            $phone = '254' . substr($phone, 1);
        } elseif (substr($phone, 0, 1) !== '2') {
            $phone = '254' . $phone;
        }

        $api = new Nabbis_MPesa_API($this);
        $response = $api->stk_push($order, $phone);

        if (is_wp_error($response)) {
            wc_add_notice($response->get_error_message(), 'error');
            return ['result' => 'failure'];
        }

        $order->update_meta_data('_nabbis_mpesa_checkout_request_id', $response['CheckoutRequestID'] ?? '');
        $order->update_meta_data('_nabbis_mpesa_phone', $phone);
        $order->save();

        $order->set_status('on-hold', __('Awaiting M-Pesa payment confirmation.', 'nabbis-mpesa'));
        $order->save();

        WC()->cart->empty_cart();

        return [
            'result'   => 'success',
            'redirect' => $this->get_return_url($order),
        ];
    }

    public function thankyou_page($order_id) {
        $order = wc_get_order($order_id);
        $checkout_id = $order->get_meta('_nabbis_mpesa_checkout_request_id');
        $phone = $order->get_meta('_nabbis_mpesa_phone');

        echo '<div class="nabbis-mpesa-thankyou">';
        echo '<h3>' . esc_html__('M-Pesa Payment', 'nabbis-mpesa') . '</h3>';
        echo '<p>' . esc_html__('Please check your phone for the M-Pesa STK Push prompt.', 'nabbis-mpesa') . '</p>';
        echo '<p><strong>' . esc_html__('Phone:', 'nabbis-mpesa') . '</strong> ' . esc_html($phone) . '</p>';
        echo '<p><strong>' . esc_html__('Status:', 'nabbis-mpesa') . '</strong> ' . esc_html__('Awaiting payment confirmation...', 'nabbis-mpesa') . '</p>';
        echo '<p class="nabbis-mpesa-waiting"><span class="nabbis-spinner"></span> ' . esc_html__('Waiting for payment...', 'nabbis-mpesa') . '</p>';
        echo '</div>';
    }

    public function process_refund($order_id, $amount = null, $reason = '') {
        $order = wc_get_order($order_id);
        if (!$order) return false;

        $order->add_order_note(sprintf(
            __('M-Pesa refund initiated: %s (Reason: %s)', 'nabbis-mpesa'),
            wc_price($amount),
            $reason
        ));
        return true;
    }
}
