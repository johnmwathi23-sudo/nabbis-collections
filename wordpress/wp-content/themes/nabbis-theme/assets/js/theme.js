/**
 * Nabbis Collections - Theme JavaScript
 */

(function($) {
    'use strict';

    const Nabbis = {
        init: function() {
            this.mobileMenu();
            this.searchToggle();
            this.addToCartAjax();
            this.qtySelector();
        },

        mobileMenu: function() {
            const toggle = $('.nabbis-mobile-toggle');
            const nav = $('.nabbis-header-nav');

            if (!toggle.length) return;

            toggle.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                nav.toggleClass('open');
                $(this).attr('aria-expanded', nav.hasClass('open'));
            });

            $(document).on('click', function(e) {
                if (!$(e.target).closest('.nabbis-header').length) {
                    nav.removeClass('open');
                }
            });
        },

        searchToggle: function() {
            $('.nabbis-search-toggle').on('click', function(e) {
                const input = $(this).find('input[type="search"]');
                if (input.length && !$(e.target).is('input')) {
                    input.focus();
                }
            });
        },

        addToCartAjax: function() {
            $(document.body).on('added_to_cart', function(e, fragments, cart_hash, button) {
                const message = $(button).data('success_message') || 'Item added to cart!';
                if (typeof nabbisData !== 'undefined') {
                    Nabbis.showNotice(message, 'success');
                }
            });
        },

        qtySelector: function() {
            $(document).on('click', '.nabbis-qty-minus', function() {
                const input = $(this).siblings('.qty');
                const val = parseInt(input.val()) || 1;
                if (val > 1) input.val(val - 1).trigger('change');
            });

            $(document).on('click', '.nabbis-qty-plus', function() {
                const input = $(this).siblings('.qty');
                const val = parseInt(input.val()) || 1;
                const max = parseInt(input.attr('max')) || 999;
                if (val < max) input.val(val + 1).trigger('change');
            });
        },

        showNotice: function(message, type) {
            const notice = $('<div class="nabbis-notice nabbis-notice-' + type + '">' +
                '<span>' + message + '</span>' +
                '<button class="nabbis-notice-close">&times;</button>' +
                '</div>');

            $('body').append(notice);
            notice.css({ top: '1rem', right: '1rem' });

            setTimeout(function() {
                notice.addClass('nabbis-notice-show');
            }, 10);

            notice.find('.nabbis-notice-close').on('click', function() {
                notice.removeClass('nabbis-notice-show');
                setTimeout(function() { notice.remove(); }, 300);
            });

            setTimeout(function() {
                notice.removeClass('nabbis-notice-show');
                setTimeout(function() { notice.remove(); }, 300);
            }, 4000);
        }
    };

    $(document).ready(function() {
        Nabbis.init();
    });

})(jQuery);
