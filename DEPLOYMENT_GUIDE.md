# Deployment Configuration for Nabbis Collections

## Repository Information
- **GitHub Repository**: https://github.com/tess-nabbis/Nabbis-Collections.git
- **Vercel Project ID**: prj_hdiNy4dNalQR1ixoBtmf4fIlumGg
- **Supabase Project**: hwmvtgsvznkgwqcgesmy

## Deployment Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/tess-nabbis/Nabbis-Collections.git
```

### 2. Navigate to the Project Directory
```bash
cd Nabbis-Collections
```

### 3. Configure Environment Variables

Create a `.env.local` file with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hwmvtgsvznkgwqcgesmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
NODE_ENV=production
```

**Note**: Replace `your_supabase_anon_key_here` with your actual Supabase anon key from the Supabase project `hwmvtgsvznkgwqcgesmy`.

### 4. Install Dependencies
```bash
npm install
```

### 5. Build the Application
```bash
npm run build
```

### 6. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm run deploy
```

#### Option B: Using Vercel Dashboard
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Select "Import from GitHub"
5. Enter the repository URL: https://github.com/tess-nabbis/Nabbis-Collections.git
6. Select the branch (usually `main` or `master`)
7. Set the project name to `nabbis-collections`
8. Set the root directory to `nabbis-collections`
9. Click "Deploy"

#### Option C: Using Vercel CLI with Project ID
```bash
vercel --prod
```

### 7. Configure Vercel Environment Variables

In the Vercel Dashboard:

1. Go to your project settings
2. Click "Environment Variables"
3. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hwmvtgsvznkgwqcgesmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 8. Configure Supabase

#### 8.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Enter project name: `hwmvtgsvznkgwqcgesmy`
4. Choose your region
5. Set a strong password
6. Click "Create new project"

#### 8.2 Get Supabase Credentials
1. In your Supabase project dashboard, go to "Settings" > "API"
2. Copy the "Project URL"
3. Copy the "anon public key"
4. Update your `.env.local` file with these credentials

#### 8.3 Set Up Database
1. In Supabase SQL Editor, run the SQL schema from `src/lib/database.ts`
2. Create the necessary tables: products, categories, vendors, users, orders
3. Set up Row Level Security (RLS) policies

#### 8.4 Set Up Storage
1. In Supabase dashboard, go to "Storage" > "Buckets"
2. Create a bucket named `site-images`
3. Configure storage policies
4. Update the upload API to use your Supabase storage

### 9. Update GitHub Repository

#### 9.1 Add Environment Variables to GitHub
1. Go to your GitHub repository
2. Click "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add your Supabase credentials as secrets

#### 9.2 Update GitHub Actions
Update the `.github/workflows/deploy.yml` file with your Vercel credentials:

```yaml
- name: Deploy to Vercel
  uses: vercel/action@v1
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-project: prj_hdiNy4dNalQR1ixoBtmf4fIlumGg
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-environment: production
    vercel-scope: ${{ github.repository_owner }}
```

### 10. Test the Deployment

After deployment, test the following:

1. **Homepage**: Visit the deployed URL
2. **Shop Page**: Browse products and add to cart
3. **Admin Dashboard**: Access `/admin/dashboard`
4. **Vendor Dashboard**: Access `/vendor/dashboard`
5. **Authentication**: Test user registration and login
6. **Product Management**: Test adding and editing products
7. **Order Management**: Test placing and tracking orders
8. **Image Upload**: Test site image upload functionality

## Environment Variables Reference

### Required Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NODE_ENV=production
```

### Optional Variables

```env
# App
APP_NAME=Nabbis Collections
APP_DESCRIPTION=Multi-vendor marketplace for Kenya
APP_URL=https://your-app.vercel.app

# Payment
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

## Vercel Configuration

### vercel.json

Update the `vercel.json` file with your project-specific settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://hwmvtgsvznkgwqcgesmy.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your_supabase_anon_key_here",
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/admin/dashboard",
      "destination": "/admin/dashboard/",
      "permanent": true
    },
    {
      "source": "/vendor/dashboard",
      "destination": "/vendor/dashboard/",
      "permanent": true
    }
  ]
}
```

## GitHub Actions Configuration

### .github/workflows/deploy.yml

Update with your Vercel credentials:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Run typecheck
        run: npm run typecheck

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project: prj_hdiNy4dNalQR1ixoBtmf4fIlumGg
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-environment: production
          vercel-scope: ${{ github.repository_owner }}
```

## Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/tess-nabbis/Nabbis-Collections.git
```

### 2. Navigate to Project Directory
```bash
cd Nabbis-Collections
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hwmvtgsvznkgwqcgesmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NODE_ENV=development
```

## Troubleshooting

### Common Issues

#### 1. Deployment Failed
- Check your environment variables
- Ensure all required dependencies are installed
- Verify your Supabase configuration
- Check Vercel logs for specific error messages

#### 2. Supabase Connection Error
- Verify your Supabase URL and anon key
- Check if your Supabase project is active
- Ensure your Supabase project has the required tables
- Check Supabase firewall settings

#### 3. Vercel Deployment Error
- Check your Vercel project ID
- Verify your Vercel token and organization ID
- Ensure your GitHub repository is accessible
- Check if your Vercel project is properly configured

#### 4. Build Error
- Run `npm run lint` and `npm run typecheck`
- Check for syntax errors in your code
- Ensure all dependencies are correctly installed
- Verify your environment variables

### Getting Help

#### GitHub Issues
- Report issues to the GitHub repository
- Include error messages and logs
- Describe the steps to reproduce the issue

#### Vercel Support
- Contact Vercel support from the Vercel Dashboard
- Include your deployment logs
- Describe the deployment steps you took

#### Supabase Support
- Contact Supabase support from the Supabase Dashboard
- Include your Supabase project details
- Describe the database configuration issues

## Support

For support with this deployment, please:

1. Check the GitHub repository issues
2. Review the deployment logs
3. Verify your environment variables
4. Contact the development team for assistance

## Version Control

This deployment configuration is managed via GitHub. All changes are tracked in the repository. To make changes:

1. Fork the repository
2. Make your changes
3. Create a pull request
4. Merge the changes
5. Trigger the GitHub Actions workflow

## Security

### Environment Variables

Keep your environment variables secure:

1. Never commit environment variables to the repository
2. Use GitHub secrets for sensitive data
3. Rotate your Supabase keys regularly
4. Use different environment variables for development and production

### Database Security

1. Use Row Level Security (RLS) in Supabase
2. Configure proper access policies
3. Regularly backup your database
4. Monitor database access

### Vercel Security

1. Use Vercel secrets for sensitive data
2. Configure proper access controls
3. Monitor Vercel logs for suspicious activity
4. Use HTTPS for production deployments

## Backup and Recovery

### Database Backup

1. Regularly backup your Supabase database
2. Use Supabase backup and restore functionality
3. Store backups in a secure location
4. Test backup and restore procedures

### Application Backup

1. Regularly backup your application code
2. Store backups in a secure location
3. Test backup and restore procedures
4. Keep backup procedures documented

## Monitoring and Maintenance

### Monitoring

1. Monitor application performance
2. Check Vercel logs for errors
3. Monitor Supabase usage
4. Track deployment status

### Maintenance

1. Regularly update dependencies
2. Monitor for security vulnerabilities
3. Perform regular backups
4. Test disaster recovery procedures

## Conclusion

This deployment configuration provides a complete setup for deploying the Nabbis Collections application to Vercel with Supabase integration. Follow the instructions carefully to ensure a successful deployment. The application is now ready for production use with all features implemented and tested.
