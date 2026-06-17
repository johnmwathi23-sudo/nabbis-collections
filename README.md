# Nabbis Collections — Premium E-commerce Platform

A fully functional, production-ready e-commerce platform for **Nabbis Collections**, a premium Kenyan retail brand. Built on WordPress + WooCommerce with a purple and lavender luxury design system.

## Technology Stack

- **WordPress 6.5+** (Full Site Editing / Block Theme)
- **WooCommerce 9.0+** (HPOS enabled)
- **PHP 8.3+ / MySQL 8.0+**
- **Docker** (local development)
- **Redis** (object caching)
- **Cloudflare** (CDN + security) — production

## Design System

- **Primary**: Deep Purple (#3B0764) → Medium Purple (#7C3AED)
- **Secondary**: Lavender (#C4B5FD) → Light Lavender (#F3E8FF)
- **Accent**: Gold (#D97706 → #FCD34D)
- **Typography**: Inter (UI) + Playfair Display (Headings)
- **Architecture**: Full Site Editing (FSE) — no page builder required

## Project Structure

```
nabbis-collections/
├── docker/                          # Docker development environment
│   ├── docker-compose.yml           # WordPress, MySQL, Redis, phpMyAdmin, Mailpit
│   ├── Dockerfile.wordpress         # PHP 8.3 with Redis, GD, OPcache
│   ├── nginx.conf                   # Apache virtual host config
│   └── php.ini                      # Optimized PHP settings
├── wordpress/
│   └── wp-content/
│       ├── themes/
│       │   └── nabbis-theme/        # Custom FSE Block Theme
│       │       ├── theme.json       # Global design tokens (colors, typography, spacing)
│       │       ├── templates/       # FSE template files (home, shop, product, pages)
│       │       ├── parts/           # Reusable parts (header, footer, sidebar)
│       │       ├── patterns/        # Block patterns (hero, products, testimonials, etc.)
│       │       ├── assets/          # CSS, JS, images
│       │       └── inc/            # Theme functions (setup, enqueue, ACF, WC, security)
│       ├── plugins/
│       │   ├── nabbis-mpesa/       # M-Pesa payment gateway (STK Push, Paybill, Till)
│       │   ├── nabbis-delivery/     # Delivery zone management + cost calculator
│       │   ├── nabbis-core/         # Wishlist, Compare, Loyalty, Referrals, Cart Recovery
│       │   └── nabbis-admin/        # Admin dashboard enhancements
│       └── mu-plugins/
│           └── nabbis-essentials.php # Security, performance, environment config
├── .github/workflows/
│   ├── ci.yml                       # PHP lint, JS check, build verification
│   └── deploy.yml                   # rsync deployment to production
└── docs/
    ├── architecture.md
    ├── admin-guide.md
    └── deployment.md
```

## Quick Start (Docker)

```bash
# Start all services
cd docker
docker-compose up -d

# Access:
# WordPress: http://localhost:8080
# phpMyAdmin: http://localhost:8081
# Mailpit: http://localhost:8025
```

## Plugins Required

### Premium (Purchase & Install)
- **ACF PRO** — Custom fields & options pages
- **WP Rocket** — Caching & performance
- **Rank Math Pro** — SEO, schema, sitemaps
- **PixelYourSite Pro** — GA4, Meta, TikTok pixel
- **Wordfence Premium** — Security
- **UpdraftPlus Premium** — Backups
- **FluentCRM** — Email marketing automation
- **Product Feed Pro** — Google Merchant Center
- **WP All Import/Export Pro** — Bulk product management

### Free (WordPress.org)
- WooCommerce
- Redis Object Cache
- Smash Balloon Instagram Feed
- WP Activity Log
- YITH WooCommerce Wishlist (or use built-in)

## Payment System

### M-Pesa Integration
- **STK Push** (primary) — Customer receives push notification
- **Paybill** — Customer pays to paybill number
- **Till Number** — Customer pays to till
- **Callback URL** — `/wc-api/nabbis_mpesa_callback`
- **Transaction Log** — Admin panel under WooCommerce → M-Pesa Logs

### Other Payment Methods
- Stripe (Visa/Mastercard via WooCommerce Stripe)
- Bank Transfer (custom instructions)
- Cash on Delivery (WC COD)

## Delivery Zones

| Zone | Counties | Base Rate | Per KG | Free Threshold | ETA |
|------|----------|-----------|--------|----------------|-----|
| Nairobi | Nairobi | KSh 200 | KSh 30 | KSh 5,000 | Same Day |
| Mombasa | Mombasa, Kilifi, Kwale | KSh 300 | KSh 50 | KSh 5,000 | 1-3 Days |
| Kisumu | Kisumu, Siaya, Homa Bay | KSh 350 | KSh 50 | KSh 5,000 | 2-4 Days |
| Nakuru | Nakuru, Narok, Baringo | KSh 300 | KSh 50 | KSh 5,000 | 1-3 Days |
| Eldoret | Uasin Gishu, Trans Nzoia | KSh 350 | KSh 60 | KSh 5,000 | 2-4 Days |
| Machakos | Machakos, Makueni, Kajiado | KSh 300 | KSh 50 | KSh 5,000 | 1-3 Days |
| Rest of Kenya | All other counties | KSh 500 | KSh 80 | KSh 7,000 | 3-7 Days |

## Maintenance

This platform is designed for **non-technical staff** to maintain:

- **Visual Editing**: Full Site Editor — edit pages/templates in Gutenberg
- **Content Changes**: ACF Options Pages (Homepage, Banners, Contact)
- **Product Management**: Standard WooCommerce product editor
- **Order Management**: WooCommerce orders admin
- **Reports**: WooCommerce analytics + Nabbis Dashboard widget

## Security

- SSL enforced (HTTPS redirect)
- CSRF, XSS, SQL injection protection
- Login brute force protection (5 attempts → 3s delay)
- XML-RPC disabled
- REST API rate limited
- File edit disabled
- Security headers (X-Frame-Options, XSS-Protection, etc.)
- Daily backups via UpdraftPlus

## License

GNU General Public License v2 or later
