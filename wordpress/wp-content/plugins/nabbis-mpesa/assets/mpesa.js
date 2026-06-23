jQuery(function($) {
    'use strict';

    // Format phone number input
    $('#nabbis-mpesa-phone').on('input', function() {
        var val = $(this).val().replace(/[^0-9+]/g, '');
        $(this).val(val);
    });

    // Validate phone on blur
    $('#nabbis-mpesa-phone').on('blur', function() {
        var val = $(this).val().replace(/[^0-9]/g, '');
        if (val.length > 0 && val.length < 10) {
            $(this).addClass('error').css('border-color', '#DC2626');
        } else {
            $(this).removeClass('error').css('border-color', '');
        }
    });

    // Poll for payment confirmation
    if ($('.nabbis-mpesa-waiting').length) {
        var orderId = new URLSearchParams(window.location.search).get('key');
        if (!orderId) {
            // Extract from URL path
            var parts = window.location.pathname.split('/');
            orderId = parts[parts.length - 1];
        }

        if (orderId) {
            (function poll() {
                $.ajax({
                    url: nabbisMpesa.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'nabbis_mpesa_check_status',
                        order_id: orderId,
                        nonce: nabbisMpesa.nonce
                    },
                    success: function(response) {
                        if (response.success) {
                            if (response.data.status === 'completed') {
                                $('.nabbis-mpesa-waiting').html(
                                    '<span style="color:#059669;font-weight:600;">Payment confirmed!</span>'
                                );
                                setTimeout(function() {
                                    window.location.href = window.location.href;
                                }, 2000);
                            } else if (response.data.status === 'failed') {
                                $('.nabbis-mpesa-waiting').html(
                                    '<span style="color:#DC2626;font-weight:600;">Payment failed. Please contact support.</span>'
                                );
                            } else {
                                setTimeout(poll, 3000);
                            }
                        } else {
                            setTimeout(poll, 5000);
                        }
                    },
                    error: function() {
                        setTimeout(poll, 5000);
                    }
                });
            })();
        }
    }
});
