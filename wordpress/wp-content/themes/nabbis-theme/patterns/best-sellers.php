<?php
/**
 * Title: Best Sellers
 * Slug: nabbis-theme/best-sellers
 * Categories: nabbis/products
 * Viewport Width: 1200
 */
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"clamp(3rem, 5vw, 6rem)","bottom":"clamp(3rem, 5vw, 6rem)"}}}} -->
<div class="wp-block-group alignfull" style="padding-top:clamp(3rem, 5vw, 6rem);padding-bottom:clamp(3rem, 5vw, 6rem)">
  <!-- wp:group {"layout":{"type":"constrained"}} -->
  <div class="wp-block-group">
    <!-- wp:heading {"textAlign":"center","level":2} -->
    <h2 class="wp-block-heading has-text-align-center">Best Sellers</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","textColor":"gray-600","style":{"typography":{"fontSize":"1.125rem"}}} -->
    <p class="has-text-align-center has-gray-600-color has-text-color" style="font-size:1.125rem">Our most popular products loved by customers</p>
    <!-- /wp:paragraph -->

    <!-- wp:woocommerce/product-query {"queryId":2,"query":{"perPage":4,"pages":0,"offset":0,"postType":"product","order":"desc","orderBy":"popularity","search":"","exclude":[],"inherit":false,"taxQuery":[],"isProductCollectionBlock":true,"woocommerceOnSale":false},"tags":[],"displayLayout":{"type":"flex","columns":4},"align":"wide"} -->
    <div class="wp-block-query alignwide">
      <!-- wp:post-template {"__woocommerceNamespace":"woocommerce/product-query/product-template"} -->
      <!-- wp:woocommerce/product-image {"isDescendentOfQueryLoop":true} /-->
      <!-- wp:post-title {"textAlign":"center","level":3,"fontSize":"md","__woocommerceNamespace":"woocommerce/product-query/product-title"} /-->
      <!-- wp:woocommerce/product-price {"textAlign":"center","fontSize":"sm","style":{"spacing":{"margin":{"bottom":"1rem"}}}} /-->
      <!-- wp:woocommerce/add-to-cart-form {"isDescendentOfQueryLoop":true} /-->
      <!-- /wp:post-template -->
    </div>
    <!-- /wp:woocommerce/product-query -->
  </div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->
