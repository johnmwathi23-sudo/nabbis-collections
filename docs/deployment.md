# Nabbis Collections - Deployment Guide

## Local Development

### Prerequisites
- Docker Desktop
- Git

### Steps
```bash
git clone <repo-url> nabbis-collections
cd nabbis-collections/docker
docker-compose up -d
```

### Access
- WordPress: http://localhost:8080
- phpMyAdmin: http://localhost:8081
- Mailpit: http://localhost:8025

### First-time Setup
1. Complete WordPress installation at http://localhost:8080
2. Install and activate plugins:
   - WooCommerce
   - ACF PRO
   - Nabbis M-Pesa
   - Nabbis Delivery
   - Nabbis Core
   - Nabbis Admin
3. Activate Nabbis Collections theme
4. Configure WooCommerce settings:
   - Currency: KES
   - Enable HPOS
   - Set up shipping zones
5. Configure M-Pesa gateway with sandbox credentials
6. Run: `wp rewrite flush` to add custom endpoints

## Production Deployment

### Prerequisites
- VPS with Ubuntu 22.04+ / Debian 12+
- Nginx or Apache + PHP 8.3+
- MySQL 8.0+
- Redis 7+
- SSL certificate (Let's Encrypt or Cloudflare)
- Domain pointing to server

### Recommended Stack
- **Web Server**: Nginx with PHP-FPM
- **Database**: MySQL 8.0 with InnoDB
- **Cache**: Redis 7 for object cache + WP Rocket
- **CDN**: Cloudflare with APO
- **Backups**: UpdraftPlus to S3/Wasabi/Google Drive
- **Monitoring**: New Relic or similar

### CI/CD Deployment
The `.github/workflows/deploy.yml` workflow deploys on push to `main` branch.

#### GitHub Secrets Required
| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | Server IP or hostname |
| `DEPLOY_USER` | SSH username |
| `DEPLOY_PASS` | SSH password |
| `DEPLOY_PATH` | WordPress root path (e.g., `/var/www/html`) |

### Manual Deployment
```bash
# Sync theme
rsync -avz --delete wordpress/wp-content/themes/nabbis-theme/ user@host:/var/www/html/wp-content/themes/nabbis-theme/

# Sync plugins
rsync -avz --delete wordpress/wp-content/plugins/nabbis-mpesa/ user@host:/var/www/html/wp-content/plugins/nabbis-mpesa/
rsync -avz --delete wordpress/wp-content/plugins/nabbis-delivery/ user@host:/var/www/html/wp-content/plugins/nabbis-delivery/
rsync -avz --delete wordpress/wp-content/plugins/nabbis-core/ user@host:/var/www/html/wp-content/plugins/nabbis-core/
rsync -avz --delete wordpress/wp-content/plugins/nabbis-admin/ user@host:/var/www/html/wp-content/plugins/nabbis-admin/
rsync -avz --delete wordpress/wp-content/mu-plugins/ user@host:/var/www/html/wp-content/mu-plugins/

# Post-deploy
wp cache flush
wp rewrite flush
wp theme activate nabbis-theme
```

### Post-Deployment Checklist
- [ ] SSL certificate active (Cloudflare Full Strict)
- [ ] M-Pesa callback URL accessible: `https://domain.com/wc-api/nabbis_mpesa_callback`
- [ ] WP Rocket enabled with Cloudflare APO
- [ ] Redis object cache working
- [ ] Google Analytics 4 tracking verified
- [ ] Search Console property verified
- [ ] Google Merchant Center feed submitted
- [ ] Backups configured and tested
- [ ] Monitoring alerts set up
