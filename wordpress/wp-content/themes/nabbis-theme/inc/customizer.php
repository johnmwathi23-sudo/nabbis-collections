<?php
if (!defined('ABSPATH')) exit;

add_action('customize_register', 'nabbis_customize_register');
function nabbis_customize_register($wp_customize) {
    $wp_customize->add_section('nabbis_branding', [
        'title'    => __('Nabbis Branding', 'nabbis-theme'),
        'priority' => 30,
    ]);

    $wp_customize->add_setting('nabbis_primary_color', [
        'default'           => '#5B21B6',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ]);

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'nabbis_primary_color', [
        'label'    => __('Primary Color', 'nabbis-theme'),
        'section'  => 'nabbis_branding',
    ]));

    $wp_customize->add_setting('nabbis_accent_color', [
        'default'           => '#D97706',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ]);

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'nabbis_accent_color', [
        'label'    => __('Accent/Gold Color', 'nabbis-theme'),
        'section'  => 'nabbis_branding',
    ]));

    $wp_customize->add_setting('nabbis_whatsapp_number', [
        'default'           => '+254700000000',
        'sanitize_callback' => 'sanitize_text_field',
    ]);

    $wp_customize->add_control('nabbis_whatsapp_number', [
        'label'    => __('WhatsApp Number', 'nabbis-theme'),
        'section'  => 'nabbis_branding',
        'type'     => 'text',
    ]);

    $wp_customize->add_setting('nabbis_whatsapp_message', [
        'default'           => 'Hello Nabbis Collections! I have a question about...',
        'sanitize_callback' => 'sanitize_text_field',
    ]);

    $wp_customize->add_control('nabbis_whatsapp_message', [
        'label'    => __('Default WhatsApp Message', 'nabbis-theme'),
        'section'  => 'nabbis_branding',
        'type'     => 'text',
    ]);

    $wp_customize->add_setting('nabbis_delivery_notice', [
        'default'           => 'Free delivery for orders above KES 5,000',
        'sanitize_callback' => 'sanitize_text_field',
    ]);

    $wp_customize->add_control('nabbis_delivery_notice', [
        'label'    => __('Delivery Notice', 'nabbis-theme'),
        'section'  => 'nabbis_branding',
        'type'     => 'text',
    ]);

    $wp_customize->selective_refresh->add_partial('nabbis_delivery_notice', [
        'selector' => '.nabbis-delivery-notice',
        'render_callback' => function() {
            return get_theme_mod('nabbis_delivery_notice', 'Free delivery for orders above KES 5,000');
        },
    ]);
}
