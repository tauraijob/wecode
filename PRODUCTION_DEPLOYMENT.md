# Production Deployment Commands - wecode.co.zw

## Step-by-Step Deployment Process

### 1. **Set Environment Variables**

Make sure these are set in your production server/hosting environment:

```env
# Production Environment
NODE_ENV=production

# Database
DATABASE_URL=your_production_database_url

# PayNow Integration
PAYNOW_INTEGRATION_ID=22658
PAYNOW_INTEGRATION_KEY=a5651864-acc3-478f-b093-3a8e8c4f7dd7
SITE_URL=https://wecode.co.zw
# DO NOT set PAYNOW_TEST_EMAIL in production - system uses user's email

# Email Configuration (Brevo)
BREVO_SMTP_USER=your_brevo_smtp_user
BREVO_SMTP_KEY=your_brevo_smtp_key
MAIL_FROM=info@wecode.co.zw

# JWT Secret (if you have one)
JWT_SECRET=your_jwt_secret
```

### 2. **Install Dependencies**

```bash
npm install
# or
npm ci  # for production (uses package-lock.json exactly)
```

### 3. **Generate Prisma Client**

```bash
npx prisma generate
```

### 4. **Run Database Migrations**

**IMPORTANT:** Run this BEFORE starting the application:

```bash
npx prisma migrate deploy
```

This will:
- Apply all pending migrations to the production database
- Add the `emailVerified` column if not already present
- Update the database schema to match your Prisma schema

**Note:** This is safe to run multiple times - it only applies migrations that haven't been run yet.

### 5. **Build the Application**

```bash
npm run build
```

This creates the production build in `.output` directory.

### 6. **Start the Application**

Depending on your hosting setup:

**Option A: Using PM2 (Recommended)**
```bash
pm2 start ecosystem.config.cjs
# or
pm2 start npm --name "wecodezw" -- start
```

**Option B: Using Node directly**
```bash
node .output/server/index.mjs
```

**Option C: Using Nuxt CLI**
```bash
npm run preview
```

### 7. **Verify Deployment**

1. Check that the site loads: `https://wecode.co.zw`
2. Test login functionality
3. Test PayNow payment flow
4. Check server logs for any errors

---

## Quick Deployment Script

Here's a complete deployment script you can run:

```bash
#!/bin/bash
# Production Deployment Script

echo "🚀 Starting production deployment..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm ci

# 2. Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# 3. Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# 4. Build application
echo "🏗️  Building application..."
npm run build

# 5. Restart application (if using PM2)
echo "🔄 Restarting application..."
pm2 restart wecodezw || pm2 start ecosystem.config.cjs

echo "✅ Deployment complete!"
```

---

## Post-Deployment Checklist

### ✅ Database
- [ ] Migrations applied successfully
- [ ] `emailVerified` column exists in `user` table
- [ ] All tables created correctly

### ✅ Environment Variables
- [ ] `SITE_URL=https://wecode.co.zw` is set
- [ ] `NODE_ENV=production` is set
- [ ] PayNow credentials are set
- [ ] Brevo email credentials are set
- [ ] Database URL is correct

### ✅ PayNow Configuration
- [ ] Webhook URL in PayNow dashboard: `https://wecode.co.zw/api/paynow/result`
- [ ] Return URL configured: `https://wecode.co.zw/dashboard/learn`
- [ ] Test a payment to verify webhooks work

### ✅ Application
- [ ] Site loads at `https://wecode.co.zw`
- [ ] SSL certificate is valid
- [ ] User registration works
- [ ] Email verification emails are sent
- [ ] Login works
- [ ] Course enrollment works
- [ ] Payment flow works end-to-end

### ✅ Monitoring
- [ ] Server logs are accessible
- [ ] Error tracking is set up (if applicable)
- [ ] PayNow webhook logs are monitored

---

## Troubleshooting

### If migrations fail:
```bash
# Check migration status
npx prisma migrate status

# If there's drift, you may need to:
npx prisma db push  # Only for development, NOT recommended for production
```

### If Prisma Client is out of sync:
```bash
npx prisma generate
```

### If build fails:
```bash
# Clear cache and rebuild
rm -rf .nuxt .output node_modules/.cache
npm run build
```

### If PayNow webhooks don't work:
1. Verify `SITE_URL` is set to `https://wecode.co.zw`
2. Check PayNow dashboard has correct webhook URL
3. Verify SSL certificate is valid
4. Check server logs for webhook requests
5. Ensure firewall allows PayNow servers

---

## Rollback Procedure

If something goes wrong:

1. **Stop the application:**
   ```bash
   pm2 stop wecodezw
   # or kill the process
   ```

2. **Revert to previous deployment** (if using Git):
   ```bash
   git checkout <previous-commit>
   npm install
   npx prisma generate
   npm run build
   pm2 restart wecodezw
   ```

3. **Check database** - migrations are usually safe, but if needed:
   ```bash
   # Check what migrations were applied
   npx prisma migrate status
   ```

---

## Important Notes

1. **Never run `prisma migrate dev` in production** - use `prisma migrate deploy` instead
2. **Never run `prisma migrate reset` in production** - this will delete all data
3. **Always backup your database** before running migrations in production
4. **Test migrations on staging first** if possible
5. **Monitor logs** after deployment for any errors

---

## Summary of Commands

```bash
# Complete deployment sequence:
npm ci                                    # Install dependencies
npx prisma generate                       # Generate Prisma Client
npx prisma migrate deploy                 # Apply database migrations
npm run build                             # Build application
pm2 restart wecodezw                      # Restart application (or start it)
```

That's it! Your application should now be live at `https://wecode.co.zw` 🎉



