/**
 * Nabbis Collections - Checkout Enhancements
 */
(function($) {
    'use strict';

    if (typeof wc_checkout_params === 'undefined') return;

    $(document.body).on('updated_checkout', function() {
        NabbisCheckout.formatPhoneNumbers();
        NabbisCheckout.validatePhone();
    });

    const NabbisCheckout = {
        formatPhoneNumbers: function() {
            $('#nabbis-mpesa-phone').on('input', function() {
                let val = $(this).val().replace(/[^0-9+]/g, '');
                $(this).val(val);
            });
        },

        validatePhone: function() {
            $('#nabbis-mpesa-phone').on('blur', function() {
                let val = $(this).val().replace(/[^0-9]/g, '');
                if (val.length > 0 && val.length < 10) {
                    $(this).addClass('error');
                } else {
                    $(this).removeClass('error');
                }
            });
        },

        showMpesaStatus: function(orderId) {
            const statusEl = $('.nabbis-mpesa-waiting');
            if (!statusEl.length || !orderId) return;

            const checkStatus = function() {
                $.get(nabbisData.ajaxUrl, {
                    action: 'nabbis_mpesa_check_status',
                    order_id: orderId,
                    nonce: nabbisData.nonce
                }, function(response) {
                    if (response.success && response.data.status === 'completed') {
                        statusEl.html('<span style="color: var(--nabbis-success); font-weight: 600;">' +
                            'Payment confirmed! Receipt: ' + response.data.receipt + '</span>');
                        setTimeout(function() {
                            window.location.href = nabbisData.checkoutUrl + '/order-received/' + orderId;
                        }, 2000);
                    } else if (response.success && response.data.status === 'failed') {
                        statusEl.html('<span style="color: var(--nabbis-error); font-weight: 600;">' +
                            'Payment failed. Please try again.</span>');
                    } else {
                        setTimeout(checkStatus, 3000);
                    }
                });
            };

            setTimeout(checkStatus, 5000);
        }
    };

    $(document).ready(function() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order_id');
        if (orderId) {
            NabbisCheckout.showMpesaStatus(orderId);
        }
    });

})(jQuery);
