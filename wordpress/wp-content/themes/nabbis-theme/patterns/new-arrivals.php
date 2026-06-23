<?php
/**
 * Title: New Arrivals
 * Slug: nabbis-theme/new-arrivals
 * Categories: nabbis/products
 * Viewport Width: 1200
 */
?>
<!-- wp:group {"align":"full","backgroundColor":"gray-50","style":{"spacing":{"padding":{"top":"clamp(3rem, 5vw, 6rem)","bottom":"clamp(3rem, 5vw, 6rem)"}}}} -->
<div class="wp-block-group alignfull has-gray-50-background-color has-background" style="padding-top:clamp(3rem, 5vw, 6rem);padding-bottom:clamp(3rem, 5vw, 6rem)">
  <!-- wp:group {"layout":{"type":"constrained"}} -->
  <div class="wp-block-group">
    <!-- wp:heading {"textAlign":"center","level":2} -->
    <h2 class="wp-block-heading has-text-align-center">New Arrivals</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","textColor":"gray-600","style":{"typography":{"fontSize":"1.125rem"}}} -->
    <p class="has-text-align-center has-gray-600-color has-text-color" style="font-size:1.125rem">Be the first to wear the latest trends</p>
    <!-- /wp:paragraph -->

    <!-- wp:woocommerce/product-query {"queryId":1,"query":{"perPage":4,"pages":0,"offset":0,"postType":"product","order":"desc","orderBy":"date","search":"","exclude":[],"inherit":false,"taxQuery":[],"isProductCollectionBlock":true,"woocommerceOnSale":false},"tags":[],"displayLayout":{"type":"flex","columns":4},"align":"wide"} -->
    <div class="wp-block-query alignwide">
      <!-- wp:post-template {"__woocommerceNamespace":"woocommerce/product-query/product-template"} -->
      <!-- wp:woocommerce/product-image {"isDescendentOfQueryLoop":true} /-->
      <!-- wp:post-title {"textAlign":"center","level":3,"fontSize":"md","__woocommerceNamespace":"woocommerce/product-query/product-title"} /-->
      <!-- wp:woocommerce/product-price {"textAlign":"center","fontSize":"sm","style":{"spacing":{"margin":{"bottom":"1rem"}}}} /-->
      <!-- wp:woocommerce/add-to-cart-form {"isDescendentOfQueryLoop":true} /-->
      <!-- /wp:post-template -->
    </div>
    <!-- /wp:woocommerce/product-query -->

    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
    <div class="wp-block-buttons" style="margin-top:2rem">
      <!-- wp:button {"backgroundColor":"purple-primary"} -->
      <div class="wp-block-button"><a class="wp-block-button__link has-purple-primary-background-color has-background wp-element-button" href="/new-arrivals">View All New Arrivals</a></div>
      <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
  </div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->
