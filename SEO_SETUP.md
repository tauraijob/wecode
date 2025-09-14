# SEO & Analytics Setup Guide

## Environment Variables

Add these to your `.env` file:

```bash
# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SITE_URL=https://wecodezw.com
```

## Google Analytics 4 Setup

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new GA4 property for your website
3. Copy your Measurement ID (format: G-XXXXXXXXXX)
4. Add it to your environment variables as `GOOGLE_ANALYTICS_ID`
5. Deploy your site - analytics will automatically start tracking

## Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: `https://wecodezw.com`
3. Choose "HTML tag" verification method
4. Copy the verification code from the meta tag
5. Replace `GOOGLE_VERIFICATION_CODE` in `public/google-site-verification.html` with your code
6. Deploy the updated file
7. Click "Verify" in Search Console

## SEO Features Included

### ✅ Automatic Sitemap
- Generated at `/sitemap.xml`
- Includes all main pages
- Updates automatically

### ✅ Structured Data (JSON-LD)
- Organization schema
- Website schema
- Service schema
- Helps search engines understand your content

### ✅ Meta Tags
- Open Graph tags for social sharing
- Twitter Card tags
- Proper title and description tags
- Keywords and author tags

### ✅ Technical SEO
- Robots.txt configuration
- Canonical URLs
- Mobile-friendly design
- Fast loading times

### ✅ PWA Support
- Web app manifest
- Mobile optimization
- Offline capabilities

## Tracking Events

The site automatically tracks:
- Page views
- Contact form submissions
- Training requests
- Button clicks

## Next Steps

1. Set up your environment variables
2. Deploy your site
3. Verify in Google Search Console
4. Check analytics data after 24-48 hours
5. Submit your sitemap to Search Console
6. Monitor performance and optimize based on data