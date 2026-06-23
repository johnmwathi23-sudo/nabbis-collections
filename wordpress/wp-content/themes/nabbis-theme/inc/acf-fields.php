<?php
if (!defined('ABSPATH')) exit;

add_action('acf/init', 'nabbis_acf_init');
function nabbis_acf_init() {
    if (!function_exists('acf_add_local_field_group') || !function_exists('acf_add_options_page')) {
        return;
    }

    acf_add_options_page([
        'page_title'  => __('Nabbis Settings', 'nabbis-theme'),
        'menu_title'  => __('Nabbis', 'nabbis-theme'),
        'menu_slug'   => 'nabbis-settings',
        'capability'  => 'manage_options',
        'redirect'    => false,
        'position'    => 2,
        'icon_url'    => 'dashicons-palmtree',
    ]);

    acf_add_options_sub_page([
        'page_title'  => __('Homepage Builder', 'nabbis-theme'),
        'menu_title'  => __('Homepage', 'nabbis-theme'),
        'parent_slug' => 'nabbis-settings',
        'menu_slug'   => 'nabbis-homepage',
    ]);

    acf_add_options_sub_page([
        'page_title'  => __('Banners & Sliders', 'nabbis-theme'),
        'menu_title'  => __('Banners', 'nabbis-theme'),
        'parent_slug' => 'nabbis-settings',
        'menu_slug'   => 'nabbis-banners',
    ]);

    acf_add_options_sub_page([
        'page_title'  => __('Theme Settings', 'nabbis-theme'),
        'menu_title'  => __('Theme Settings', 'nabbis-theme'),
        'parent_slug' => 'nabbis-settings',
        'menu_slug'   => 'nabbis-theme-settings',
    ]);

    acf_add_options_sub_page([
        'page_title'  => __('Contact & Social', 'nabbis-theme'),
        'menu_title'  => __('Contact & Social', 'nabbis-theme'),
        'parent_slug' => 'nabbis-settings',
        'menu_slug'   => 'nabbis-contact',
    ]);

    nabbis_register_homepage_fields();
    nabbis_register_banner_fields();
    nabbis_register_theme_fields();
    nabbis_register_contact_fields();
}

function nabbis_register_homepage_fields() {
    acf_add_local_field_group([
        'key' => 'group_nabbis_homepage',
        'title' => 'Homepage Content',
        'location' => [
            [['param' => 'options_page', 'operator' => '==', 'value' => 'nabbis-homepage']],
        ],
        'fields' => [
            [
                'key' => 'field_home_hero',
                'label' => 'Hero Section',
                'name' => 'home_hero',
                'type' => 'group',
                'sub_fields' => [
                    ['key' => 'field_hero_heading', 'label' => 'Heading', 'name' => 'heading', 'type' => 'text', 'default_value' => 'Premium Fashion & Lifestyle for Kenya'],
                    ['key' => 'field_hero_subheading', 'label' => 'Subheading', 'name' => 'subheading', 'type' => 'text', 'default_value' => 'Discover curated collections of fashion, bags, and home essentials delivered to your doorstep.'],
                    ['key' => 'field_hero_cta_text', 'label' => 'CTA Button Text', 'name' => 'cta_text', 'type' => 'text', 'default_value' => 'Shop Now'],
                    ['key' => 'field_hero_cta_url', 'label' => 'CTA Button Link', 'name' => 'cta_url', 'type' => 'url', 'default_value' => '/shop'],
                    ['key' => 'field_hero_image', 'label' => 'Hero Image', 'name' => 'hero_image', 'type' => 'image', 'return_format' => 'url', 'preview_size' => 'large'],
                    ['key' => 'field_hero_video', 'label' => 'Hero Video URL (optional)', 'name' => 'hero_video', 'type' => 'url'],
                ],
            ],
            [
                'key' => 'field_home_features',
                'label' => 'Featured Collections',
                'name' => 'featured_collections',
                'type' => 'repeater',
                'layout' => 'block',
                'button_label' => 'Add Collection',
                'sub_fields' => [
                    ['key' => 'field_feature_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                    ['key' => 'field_feature_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea'],
                    ['key' => 'field_feature_image', 'label' => 'Image', 'name' => 'image', 'type' => 'image', 'return_format' => 'url'],
                    ['key' => 'field_feature_link', 'label' => 'Link', 'name' => 'link', 'type' => 'url'],
                ],
            ],
            [
                'key' => 'field_home_usp',
                'label' => 'Trust Badges / USPs',
                'name' => 'trust_badges',
                'type' => 'repeater',
                'layout' => 'block',
                'button_label' => 'Add Badge',
                'sub_fields' => [
                    ['key' => 'field_usp_icon', 'label' => 'Icon (SVG or Emoji)', 'name' => 'icon', 'type' => 'text'],
                    ['key' => 'field_usp_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                    ['key' => 'field_usp_description', 'label' => 'Description', 'name' => 'description', 'type' => 'text'],
                ],
            ],
            [
                'key' => 'field_home_brand_story',
                'label' => 'Brand Story Section',
                'name' => 'brand_story',
                'type' => 'group',
                'sub_fields' => [
                    ['key' => 'field_brand_heading', 'label' => 'Heading', 'name' => 'heading', 'type' => 'text', 'default_value' => 'Our Story'],
                    ['key' => 'field_brand_content', 'label' => 'Content', 'name' => 'content', 'type' => 'wysiwyg'],
                    ['key' => 'field_brand_image', 'label' => 'Image', 'name' => 'image', 'type' => 'image', 'return_format' => 'url'],
                    ['key' => 'field_brand_cta_text', 'label' => 'CTA Text', 'name' => 'cta_text', 'type' => 'text', 'default_value' => 'Learn More'],
                    ['key' => 'field_brand_cta_url', 'label' => 'CTA URL', 'name' => 'cta_url', 'type' => 'url', 'default_value' => '/about-us'],
                ],
            ],
            [
                'key' => 'field_home_testimonials',
                'label' => 'Customer Testimonials',
                'name' => 'testimonials',
                'type' => 'repeater',
                'layout' => 'block',
                'button_label' => 'Add Testimonial',
                'sub_fields' => [
                    ['key' => 'field_testimonial_text', 'label' => 'Testimonial', 'name' => 'text', 'type' => 'textarea'],
                    ['key' => 'field_testimonial_author', 'label' => 'Author Name', 'name' => 'author', 'type' => 'text'],
                    ['key' => 'field_testimonial_location', 'label' => 'Location', 'name' => 'location', 'type' => 'text'],
                    ['key' => 'field_testimonial_rating', 'label' => 'Rating', 'name' => 'rating', 'type' => 'number', 'min' => 1, 'max' => 5],
                ],
            ],
            [
                'key' => 'field_home_newsletter',
                'label' => 'Newsletter Section',
                'name' => 'newsletter_section',
                'type' => 'group',
                'sub_fields' => [
                    ['key' => 'field_newsletter_heading', 'label' => 'Heading', 'name' => 'heading', 'type' => 'text', 'default_value' => 'Join Our Community'],
                    ['key' => 'field_newsletter_text', 'label' => 'Description', 'name' => 'description', 'type' => 'text', 'default_value' => 'Get 10% off your first order and be the first to know about new arrivals.'],
                    ['key' => 'field_newsletter_bg', 'label' => 'Background Image', 'name' => 'background', 'type' => 'image', 'return_format' => 'url'],
                ],
            ],
        ],
    ]);
}

function nabbis_register_banner_fields() {
    acf_add_local_field_group([
        'key' => 'group_nabbis_banners',
        'title' => 'Banners & Sliders',
        'location' => [
            [['param' => 'options_page', 'operator' => '==', 'value' => 'nabbis-banners']],
        ],
        'fields' => [
            [
                'key' => 'field_promotional_banners',
                'label' => 'Promotional Banners',
                'name' => 'promotional_banners',
                'type' => 'repeater',
                'layout' => 'block',
                'button_label' => 'Add Banner',
                'sub_fields' => [
                    ['key' => 'field_banner_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                    ['key' => 'field_banner_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea'],
                    ['key' => 'field_banner_image', 'label' => 'Banner Image', 'name' => 'image', 'type' => 'image', 'return_format' => 'url', 'required' => 1],
                    ['key' => 'field_banner_link', 'label' => 'Banner Link', 'name' => 'link', 'type' => 'url'],
                    ['key' => 'field_banner_text_color', 'label' => 'Text Color', 'name' => 'text_color', 'type' => 'color_picker', 'default_value' => '#FFFFFF'],
                    ['key' => 'field_banner_overlay', 'label' => 'Overlay Color', 'name' => 'overlay', 'type' => 'color_picker'],
                ],
            ],
        ],
    ]);
}

function nabbis_register_theme_fields() {
    acf_add_local_field_group([
        'key' => 'group_nabbis_theme_settings',
        'title' => 'Theme Settings',
        'location' => [
            [['param' => 'options_page', 'operator' => '==', 'value' => 'nabbis-theme-settings']],
        ],
        'fields' => [
            [
                'key' => 'field_logo_light',
                'label' => 'Logo (Light Background)',
                'name' => 'logo_light',
                'type' => 'image',
                'return_format' => 'url',
            ],
            [
                'key' => 'field_logo_dark',
                'label' => 'Logo (Dark Background)',
                'name' => 'logo_dark',
                'type' => 'image',
                'return_format' => 'url',
            ],
            [
                'key' => 'field_favicon',
                'label' => 'Favicon',
                'name' => 'favicon',
                'type' => 'image',
                'return_format' => 'url',
            ],
            [
                'key' => 'field_delivery_info',
                'label' => 'Delivery Info Bar Text',
                'name' => 'delivery_info_bar',
                'type' => 'text',
                'default_value' => 'Free delivery for orders above KES 5,000 | Same day delivery in Nairobi',
            ],
            [
                'key' => 'field_flash_sale',
                'label' => 'Enable Flash Sale Banner',
                'name' => 'flash_sale_enabled',
                'type' => 'true_false',
                'ui' => 1,
            ],
            [
                'key' => 'field_flash_text',
                'label' => 'Flash Sale Text',
                'name' => 'flash_sale_text',
                'type' => 'text',
                'default_value' => 'Flash Sale: Up to 50% Off Selected Items!',
                'conditional_logic' => [
                    ['field' => 'field_flash_sale', 'operator' => '==', 'value' => '1'],
                ],
            ],
            [
                'key' => 'field_flash_link',
                'label' => 'Flash Sale Link',
                'name' => 'flash_sale_link',
                'type' => 'url',
                'conditional_logic' => [
                    ['field' => 'field_flash_sale', 'operator' => '==', 'value' => '1'],
                ],
            ],
        ],
    ]);
}

function nabbis_register_contact_fields() {
    acf_add_local_field_group([
        'key' => 'group_nabbis_contact',
        'title' => 'Contact & Social',
        'location' => [
            [['param' => 'options_page', 'operator' => '==', 'value' => 'nabbis-contact']],
        ],
        'fields' => [
            [
                'key' => 'field_contact_phone',
                'label' => 'Phone Number',
                'name' => 'contact_phone',
                'type' => 'text',
            ],
            [
                'key' => 'field_contact_whatsapp',
                'label' => 'WhatsApp Number',
                'name' => 'contact_whatsapp',
                'type' => 'text',
            ],
            [
                'key' => 'field_contact_email',
                'label' => 'Email Address',
                'name' => 'contact_email',
                'type' => 'email',
            ],
            [
                'key' => 'field_contact_address',
                'label' => 'Physical Address',
                'name' => 'contact_address',
                'type' => 'textarea',
            ],
            [
                'key' => 'field_social_instagram',
                'label' => 'Instagram URL',
                'name' => 'social_instagram',
                'type' => 'url',
            ],
            [
                'key' => 'field_social_facebook',
                'label' => 'Facebook URL',
                'name' => 'social_facebook',
                'type' => 'url',
            ],
            [
                'key' => 'field_social_twitter',
                'label' => 'Twitter/X URL',
                'name' => 'social_twitter',
                'type' => 'url',
            ],
            [
                'key' => 'field_social_tiktok',
                'label' => 'TikTok URL',
                'name' => 'social_tiktok',
                'type' => 'url',
            ],
            [
                'key' => 'field_social_youtube',
                'label' => 'YouTube URL',
                'name' => 'social_youtube',
                'type' => 'url',
            ],
            [
                'key' => 'field_social_pinterest',
                'label' => 'Pinterest URL',
                'name' => 'social_pinterest',
                'type' => 'url',
            ],
            [
                'key' => 'field_google_maps',
                'label' => 'Google Maps Embed URL',
                'name' => 'google_maps_url',
                'type' => 'url',
            ],
        ],
    ]);
}

add_filter('acf/format_value/type=image', function($value, $post_id, $field) {
    if (is_array($value) && isset($value['url'])) {
        return $value['url'];
    }
    return $value;
}, 10, 3);
