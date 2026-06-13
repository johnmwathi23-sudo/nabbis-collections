# Nabbis Collections - Architecture

## System Architecture

### Frontend (FSE Block Theme)
- WordPress Full Site Editing
- `theme.json` — All design tokens centralized
- Templates — Static HTML with block markup
- Patterns — Reusable block patterns for pages
- No page builder dependency

### Backend (WordPress + WooCommerce)
- Custom post types: Products (WooCommerce)
- Custom taxonomies: Product categories, attributes
- Custom tables: M-Pesa transactions, delivery zones
- REST API: Custom endpoints for M-Pesa callbacks

### Database
- WordPress standard tables (wp_*)
- `wp_nabbis_mpesa_transactions` — M-Pesa log
- `wp_nabbis_delivery_zones` — Delivery zones and rates
- WooCommerce HPOS tables (custom order tables)

### Caching Layer
- Redis via `redis-cache` plugin
- WP Rocket (page cache, minification, CDN)
- Cloudflare APO (HTML cache at edge)

## Data Flow

User → Cloudflare → VPS → Nginx → PHP-FPM → WordPress → MySQL/Redis
                                                        ↓
                                                    WooCommerce → M-Pesa API (Safaricom)
                                                        ↓
                                                    Email/SMS/WhatsApp notifications
