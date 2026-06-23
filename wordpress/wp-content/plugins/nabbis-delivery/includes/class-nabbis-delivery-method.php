<?php
if (!defined('ABSPATH')) exit;

class Nabbis_Delivery_Method extends WC_Shipping_Method {

    public function __construct($instance_id = 0) {
        $this->id = 'nabbis_delivery';
        $this->instance_id = absint($instance_id);
        $this->method_title = __('Nabbis Delivery', 'nabbis-delivery');
        $this->method_description = __('County-based delivery zones with cost calculation for Nabbis Collections.', 'nabbis-delivery');
        $this->supports = ['shipping-zones', 'instance-settings', 'instance-settings-modal'];
        $this->enabled = $this->get_option('enabled', 'yes');
        $this->title = $this->get_option('title', __('Nabbis Delivery', 'nabbis-delivery'));

        $this->init();
    }

    public function init() {
        $this->init_form_fields();
        $this->init_settings();
        add_action('woocommerce_update_options_shipping_' . $this->id, [$this, 'process_admin_options']);
    }

    public function init_form_fields() {
        $this->form_fields = [
            'enabled' => [
                'title'   => __('Enable', 'nabbis-delivery'),
                'type'    => 'checkbox',
                'label'   => __('Enable Nabbis Delivery', 'nabbis-delivery'),
                'default' => 'yes',
            ],
            'title' => [
                'title'       => __('Method Title', 'nabbis-delivery'),
                'type'        => 'text',
                'description' => __('Title visible to customers at checkout.', 'nabbis-delivery'),
                'default'     => __('Nabbis Delivery', 'nabbis-delivery'),
            ],
            'handling_fee' => [
                'title'       => __('Handling Fee', 'nabbis-delivery'),
                'type'        => 'number',
                'description' => __('Additional handling fee added to all deliveries.', 'nabbis-delivery'),
                'default'     => 0,
                'min'         => 0,
            ],
        ];
    }

    public function calculate_shipping($package = []) {
        $customer_city = strtolower(trim($package['destination']['city'] ?? ''));
        $customer_state = strtolower(trim($package['destination']['state'] ?? ''));

        $zone = $this->get_delivery_zone($customer_city, $customer_state);

        if (!$zone) {
            $zone = $this->get_fallback_zone();
        }

        if (!$zone) return;

        $cart_total = WC()->cart->get_subtotal();
        $cart_weight = WC()->cart->get_cart_contents_weight();
        if ($cart_weight <= 0) $cart_weight = 1;

        $cost = $zone->base_rate;
        $cost += $zone->per_kg_rate * ceil($cart_weight);

        $handling = floatval($this->get_option('handling_fee', 0));
        $cost += $handling;

        if ($zone->free_threshold && $cart_total >= $zone->free_threshold) {
            $cost = 0;
        }

        $eta = '';
        if ($zone->eta_min !== null && $zone->eta_max !== null) {
            if ($zone->eta_min === 0 && $zone->eta_max <= 1) {
                $eta = __('Same day', 'nabbis-delivery');
            } elseif ($zone->eta_min === $zone->eta_max) {
                $eta = sprintf(_n('%d day', '%d days', $zone->eta_min, 'nabbis-delivery'), $zone->eta_min);
            } else {
                $eta = sprintf(__('%d-%d days', 'nabbis-delivery'), $zone->eta_min, $zone->eta_max);
            }
        }

        $label = $zone->zone_name;
        if ($eta) {
            $label .= ' (' . $eta . ')';
        }

        if ($cost === 0 && $zone->free_threshold) {
            $label .= ' — ' . __('Free delivery', 'nabbis-delivery');
        }

        $rate = [
            'id'      => $this->get_rate_id(),
            'label'   => $label,
            'cost'    => max(0, $cost),
            'package' => $package,
            'meta_data' => [
                '_nabbis_delivery_zone' => $zone->zone_name,
                '_nabbis_delivery_eta'  => $eta,
            ],
        ];

        $this->add_rate($rate);
    }

    private function get_delivery_zone($city, $state) {
        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_delivery_zones';

        $zones = $wpdb->get_results("SELECT * FROM $table WHERE is_active = 1 ORDER BY sort_order ASC");

        $location = $city ?: $state;

        foreach ($zones as $zone) {
            if (empty($zone->counties)) continue;
            $counties = array_map('trim', explode(',', strtolower($zone->counties)));
            foreach ($counties as $county) {
                if (strpos($location, $county) !== false || strpos($county, $location) !== false) {
                    return $zone;
                }
            }
        }

        $kenya_counties = [
            'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'machakos',
            'kiambu', 'kajiado', 'thika', 'malindi', 'nanyuki', 'naivasha',
            'meru', 'nyeri', 'emali', 'vihiga', 'bungoma', 'busia',
            'kakamega', 'kitale', 'kapenguria', 'loder', 'lokichoggio',
            'marsabit', 'isiolo', 'garissa', 'wajir', 'mandera',
        ];

        foreach ($kenya_counties as $county) {
            if (strpos($location, $county) !== false) {
                foreach ($zones as $zone) {
                    if (empty($zone->counties)) continue;
                    $counties = array_map('trim', explode(',', strtolower($zone->counties)));
                    if (in_array($county, $counties)) {
                        return $zone;
                    }
                }
            }
        }

        return null;
    }

    private function get_fallback_zone() {
        global $wpdb;
        $table = $wpdb->prefix . 'nabbis_delivery_zones';
        return $wpdb->get_row("SELECT * FROM $table WHERE zone_name = 'Rest of Kenya' AND is_active = 1 LIMIT 1");
    }
}
