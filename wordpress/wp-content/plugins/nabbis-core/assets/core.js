jQuery(function($) {
    'use strict';

    // Wishlist toggle
    $(document).on('click', '.nabbis-wishlist-btn', function(e) {
        e.preventDefault();
        var btn = $(this);
        var productId = btn.data('product-id');

        $.ajax({
            url: nabbisCore.ajaxUrl,
            method: 'POST',
            data: {
                action: 'nabbis_toggle_wishlist',
                product_id: productId,
                nonce: nabbisCore.nonce
            },
            success: function(response) {
                if (response.success) {
                    btn.toggleClass('active');
                    var heart = btn.find('svg');
                    heart.attr('fill', btn.hasClass('active') ? 'currentColor' : 'none');

                    var notice = $('<div class="nabbis-notice nabbis-notice-success">' +
                        '<span>' + response.data.message + '</span>' +
                        '<button class="nabbis-notice-close">&times;</button></div>');
                    $('body').append(notice);
                    notice.css({ top: '1rem', right: '1rem' });
                    setTimeout(function() { notice.addClass('nabbis-notice-show'); }, 10);
                    setTimeout(function() { notice.removeClass('nabbis-notice-show'); setTimeout(function() { notice.remove(); }, 300); }, 3000);
                    notice.find('.nabbis-notice-close').on('click', function() { notice.remove(); });
                }
            }
        });
    });

    // Compare toggle
    $(document).on('click', '.nabbis-compare-btn', function(e) {
        e.preventDefault();
        var btn = $(this);
        var productId = btn.data('product-id');

        $.ajax({
            url: nabbisCore.ajaxUrl,
            method: 'POST',
            data: {
                action: 'nabbis_toggle_compare',
                product_id: productId,
                nonce: nabbisCore.nonce
            },
            success: function(response) {
                if (response.success) {
                    btn.toggleClass('active');
                    var notice = $('<div class="nabbis-notice ' + (response.success ? 'nabbis-notice-success' : 'nabbis-notice-error') + '">' +
                        '<span>' + response.data.message + '</span>' +
                        '<button class="nabbis-notice-close">&times;</button></div>');
                    $('body').append(notice);
                    notice.css({ top: '1rem', right: '1rem' });
                    setTimeout(function() { notice.addClass('nabbis-notice-show'); }, 10);
                    setTimeout(function() { notice.removeClass('nabbis-notice-show'); setTimeout(function() { notice.remove(); }, 300); }, 3000);
                    notice.find('.nabbis-notice-close').on('click', function() { notice.remove(); });
                } else {
                    alert(response.data);
                }
            }
        });
    });

    // Loyalty redeem
    $(document).on('submit', '.nabbis-loyalty-redeem', function(e) {
        e.preventDefault();
        var form = $(this);
        var points = form.find('input[name="redeem_points"]').val();

        $.ajax({
            url: nabbisCore.ajaxUrl,
            method: 'POST',
            data: {
                action: 'nabbis_redeem_points',
                points: points,
                nonce: nabbisCore.nonce
            },
            success: function(response) {
                if (response.success) {
                    var notice = $('<div class="nabbis-notice nabbis-notice-success">' +
                        '<span>' + response.data.message + '</span>' +
                        '<button class="nabbis-notice-close">&times;</button></div>');
                    $('body').append(notice);
                    notice.css({ top: '1rem', right: '1rem' });
                    setTimeout(function() { notice.addClass('nabbis-notice-show'); }, 10);
                    setTimeout(function() { notice.removeClass('nabbis-notice-show'); setTimeout(function() { notice.remove(); }, 300); }, 5000);
                    notice.find('.nabbis-notice-close').on('click', function() { notice.remove(); });
                    form.find('input[name="redeem_points"]').val('');
                } else {
                    alert(response.data);
                }
            }
        });
    });

    // Compare clear
    $(document).on('click', '.nabbis-compare-clear', function(e) {
        e.preventDefault();
        $.ajax({
            url: nabbisCore.ajaxUrl,
            method: 'POST',
            data: {
                action: 'nabbis_toggle_compare',
                product_id: 0,
                nonce: $(this).data('nonce')
            },
            success: function() {
                location.reload();
            }
        });
    });
});
