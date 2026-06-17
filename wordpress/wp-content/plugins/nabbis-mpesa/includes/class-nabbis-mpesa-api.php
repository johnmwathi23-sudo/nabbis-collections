<?php
if (!defined('ABSPATH')) exit;

class Nabbis_MPesa_API {
    private $gateway;
    private $api_url;
    private $consumer_key;
    private $consumer_secret;
    private $passkey;
    private $shortcode;

    public function __construct($gateway) {
        $this->gateway = $gateway;
        $this->api_url = $gateway->api_url;
        $this->consumer_key = $gateway->consumer_key;
        $this->consumer_secret = $gateway->consumer_secret;
        $this->passkey = $gateway->passkey;
        $this->shortcode = $gateway->shortcode;
    }

    private function get_access_token() {
        $url = $this->api_url . '/oauth/v1/generate?grant_type=client_credentials';
        $credentials = base64_encode($this->consumer_key . ':' . $this->consumer_secret);

        $response = wp_remote_get($url, [
            'headers' => ['Authorization' => 'Basic ' . $credentials],
            'timeout' => 30,
        ]);

        if (is_wp_error($response)) {
            $this->log('Token generation failed: ' . $response->get_error_message());
            return new WP_Error('token_error', __('Failed to connect to M-Pesa. Please try again.', 'nabbis-mpesa'));
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (!isset($data['access_token'])) {
            $this->log('Token response invalid: ' . $body);
            return new WP_Error('token_invalid', __('M-Pesa authentication failed.', 'nabbis-mpesa'));
        }

        return $data['access_token'];
    }

    private function generate_password() {
        $timestamp = date('YmdHis');
        $password = base64_encode($this->shortcode . $this->passkey . $timestamp);
        return [$password, $timestamp];
    }

    public function stk_push($order, $phone) {
        $token = $this->get_access_token();
        if (is_wp_error($token)) return $token;

        $amount = $order->get_total();
        $account_ref = 'NABBIS-' . $order->get_order_number();
        $callback_url = add_query_arg('order_id', $order->get_id(), home_url('/wc-api/nabbis_mpesa_callback'));
        $timestamp = date('YmdHis');
        $password = base64_encode($this->shortcode . $this->passkey . $timestamp);

        $body = [
            'BusinessShortCode' => $this->shortcode,
            'Password'          => $password,
            'Timestamp'         => $timestamp,
            'TransactionType'   => 'CustomerPayBillOnline',
            'Amount'            => (int) round($amount),
            'PartyA'            => $phone,
            'PartyB'            => $this->shortcode,
            'PhoneNumber'       => $phone,
            'CallBackURL'       => $callback_url,
            'AccountReference'  => $account_ref,
            'TransactionDesc'   => 'Nabbis Collections Order#' . $order->get_order_number(),
        ];

        $this->log('STK Push Request: ' . json_encode($body));

        $response = wp_remote_post($this->api_url . '/mpesa/stkpush/v1/processrequest', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type'  => 'application/json',
            ],
            'body'    => json_encode($body),
            'timeout' => 30,
        ]);

        if (is_wp_error($response)) {
            $this->log('STK Push failed: ' . $response->get_error_message());
            return new WP_Error('stk_failed', __('Failed to initiate M-Pesa payment. Please try again.', 'nabbis-mpesa'));
        }

        $response_body = wp_remote_retrieve_body($response);
        $data = json_decode($response_body, true);

        $this->log('STK Push Response: ' . $response_body);

        if (!isset($data['ResponseCode']) || $data['ResponseCode'] !== '0') {
            $msg = $data['ResponseDescription'] ?? __('M-Pesa payment initiation failed.', 'nabbis-mpesa');
            return new WP_Error('stk_error', $msg);
        }

        $this->log_transaction([
            'order_id'            => $order->get_id(),
            'merchant_request_id' => $data['MerchantRequestID'] ?? '',
            'checkout_request_id' => $data['CheckoutRequestID'] ?? '',
            'amount'              => $amount,
            'phone_number'        => $phone,
            'status'              => 'pending',
            'raw_response'        => $response_body,
        ]);

        return $data;
    }

    public function query_status($checkout_request_id) {
        $token = $this->get_access_token();
        if (is_wp_error($token)) return $token;

        $timestamp = date('YmdHis');
        $password = base64_encode($this->shortcode . $this->passkey . $timestamp);

        $body = [
            'BusinessShortCode' => $this->shortcode,
            'Password'          => $password,
            'Timestamp'         => $timestamp,
            'CheckoutRequestID' => $checkout_request_id,
        ];

        $response = wp_remote_post($this->api_url . '/mpesa/stkpushquery/v1/query', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type'  => 'application/json',
            ],
            'body'    => json_encode($body),
            'timeout' => 30,
        ]);

        if (is_wp_error($response)) {
            return new WP_Error('query_failed', __('Failed to query M-Pesa payment status.', 'nabbis-mpesa'));
        }

        return json_decode(wp_remote_retrieve_body($response), true);
    }

    private function log_transaction($data) {
        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_mpesa_transactions';
        $wpdb->insert($table, $data);
    }

    private function log($message) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[Nabbis MPesa] ' . $message);
        }
    }
}
