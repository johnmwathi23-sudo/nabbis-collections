<?php
if (!defined('ABSPATH')) exit;

class Nabbis_MPesa_Callback {
    
    public function register_routes() {
        register_rest_route('nabbis-mpesa/v1', '/callback', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_callback'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('nabbis-mpesa/v1', '/confirm', [
            'methods'             => 'GET',
            'callback'            => [$this, 'confirm_payment'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function handle_callback($request) {
        $body = $request->get_body();
        $data = json_decode($body, true);

        $this->log('Callback received: ' . $body);

        if (!isset($data['Body']['stkCallback'])) {
            return new WP_REST_Response(['ResultCode' => 1, 'ResultDesc' => 'Invalid callback'], 400);
        }

        $callback = $data['Body']['stkCallback'];
        $checkout_request_id = $callback['CheckoutRequestID'];
        $result_code = $callback['ResultCode'];
        $result_desc = $callback['ResultDesc'];

        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_mpesa_transactions';
        $transaction = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE checkout_request_id = %s",
            $checkout_request_id
        ));

        if (!$transaction || !$transaction->order_id) {
            $this->log('No matching transaction found for: ' . $checkout_request_id);
            return new WP_REST_Response(['ResultCode' => 0, 'ResultDesc' => 'Accepted'], 200);
        }

        $order = wc_get_order($transaction->order_id);
        if (!$order) {
            $this->log('Order not found: ' . $transaction->order_id);
            return new WP_REST_Response(['ResultCode' => 0, 'ResultDesc' => 'Accepted'], 200);
        }

        $metadata = $callback['CallbackMetadata']['Item'] ?? [];

        $mpesa_receipt = '';
        $amount = 0;
        $transaction_date = '';
        $phone = '';

        foreach ($metadata as $item) {
            switch ($item['Name']) {
                case 'MpesaReceiptNumber':
                    $mpesa_receipt = $item['Value'];
                    break;
                case 'Amount':
                    $amount = $item['Value'];
                    break;
                case 'TransactionDate':
                    $transaction_date = $item['Value'];
                    break;
                case 'PhoneNumber':
                    $phone = $item['Value'];
                    break;
            }
        }

        $update_data = [
            'result_code'    => $result_code,
            'result_desc'    => $result_desc,
            'mpesa_receipt'  => $mpesa_receipt,
            'transaction_date' => $transaction_date,
            'phone_number'   => $phone ?: $transaction->phone_number,
            'amount'         => $amount ?: $transaction->amount,
            'status'         => ($result_code === 0) ? 'completed' : 'failed',
            'raw_response'   => $body,
        ];

        $wpdb->update($table, $update_data, ['id' => $transaction->id]);

        if ($result_code === 0) {
            $order->add_order_note(sprintf(
                __('M-Pesa payment confirmed. Receipt: %s | Amount: KSh %s | Date: %s', 'nabbis-mpesa'),
                $mpesa_receipt,
                number_format($amount, 2),
                $transaction_date
            ));

            $order->update_meta_data('_nabbis_mpesa_receipt', $mpesa_receipt);
            $order->update_meta_data('_nabbis_mpesa_transaction_date', $transaction_date);
            $order->update_meta_data('_transaction_id', $mpesa_receipt);
            $order->save();

            $order->payment_complete($mpesa_receipt);
        } else {
            $order->update_status('failed', sprintf(
                __('M-Pesa payment failed: %s', 'nabbis-mpesa'),
                $result_desc
            ));
        }

        return new WP_REST_Response(['ResultCode' => 0, 'ResultDesc' => 'Success'], 200);
    }

    public function confirm_payment($request) {
        $order_id = $request->get_param('order_id');
        if (!$order_id) {
            return new WP_REST_Response(['status' => 'error', 'message' => 'No order ID'], 400);
        }

        $order = wc_get_order($order_id);
        if (!$order) {
            return new WP_REST_Response(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        $checkout_id = $order->get_meta('_nabbis_mpesa_checkout_request_id');
        if (!$checkout_id) {
            return new WP_REST_Response(['status' => 'error', 'message' => 'No M-Pesa request'], 404);
        }

        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_mpesa_transactions';
        $transaction = $wpdb->get_row($wpdb->prepare(
            "SELECT status, mpesa_receipt, result_desc FROM $table WHERE checkout_request_id = %s",
            $checkout_id
        ));

        if (!$transaction) {
            return new WP_REST_Response(['status' => 'pending'], 200);
        }

        return new WP_REST_Response([
            'status'        => $transaction->status,
            'receipt'       => $transaction->mpesa_receipt,
            'message'       => $transaction->result_desc,
            'order_status'  => $order->get_status(),
        ], 200);
    }

    private function log($message) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[Nabbis MPesa Callback] ' . $message);
        }
    }
}
