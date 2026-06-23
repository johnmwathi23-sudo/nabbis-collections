<?php
/**
 * Title: Newsletter Signup
 * Slug: nabbis-theme/newsletter-signup
 * Categories: nabbis/content
 * Viewport Width: 1200
 */
?>
<!-- wp:group {"align":"full","backgroundColor":"purple-deep","style":{"spacing":{"padding":{"top":"clamp(4rem, 6vw, 6rem)","bottom":"clamp(4rem, 6vw, 6rem)"}}}} -->
<div class="wp-block-group alignfull has-purple-deep-background-color has-background" style="padding-top:clamp(4rem, 6vw, 6rem);padding-bottom:clamp(4rem, 6vw, 6rem)">
  <!-- wp:group {"layout":{"type":"constrained"}} -->
  <div class="wp-block-group">
    <!-- wp:heading {"textAlign":"center","level":2,"textColor":"white"} -->
    <h2 class="wp-block-heading has-text-align-center has-white-color has-text-color">Join Our Community</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","textColor":"lavender","style":{"typography":{"fontSize":"1.125rem"}}} -->
    <p class="has-text-align-center has-lavender-color has-text-color" style="font-size:1.125rem">Get 10% off your first order and be the first to know about new arrivals, exclusive deals, and style inspiration.</p>
    <!-- /wp:paragraph -->

    <!-- wp:group {"layout":{"type":"constrained","contentSize":"480px"}} -->
    <div class="wp-block-group">
      <!-- wp:html -->
      <form class="nabbis-newsletter-form" action="#" method="post">
        <input type="email" name="email" placeholder="Enter your email address" required>
        <button type="submit" class="nabbis-btn nabbis-btn-gold">Subscribe</button>
      </form>
      <!-- /wp:html -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->
