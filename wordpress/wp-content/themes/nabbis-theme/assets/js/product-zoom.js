/**
 * Nabbis Collections - Product Zoom
 */
(function($) {
    'use strict';

    if (typeof wc_single_product_params === 'undefined') return;

    if ($('.woocommerce-product-gallery').length) {
        $('.woocommerce-product-gallery').on('mouseenter', function() {
            if ($(window).width() >= 768) {
                const img = $(this).find('.flex-active-slide img');
                if (img.length && !img.closest('.woocommerce-product-gallery__wrapper').hasClass('nabbis-zoom-enabled')) {
                    img.closest('.woocommerce-product-gallery__wrapper').addClass('nabbis-zoom-enabled');
                }
            }
        });
    }

    $(document).ready(function() {
        if ($('.flex-control-thumbs').length) {
            $('.flex-control-thumbs').addClass('nabbis-thumbs');
        }
    });

})(jQuery);
