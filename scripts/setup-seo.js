#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 WeCodeZW SEO Setup Helper\n')

// Check if .env exists
const envPath = path.join(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Please create one first.')
  process.exit(1)
}

// Read current .env
const envContent = fs.readFileSync(envPath, 'utf8')

// Check for required variables
const requiredVars = [
  'GOOGLE_ANALYTICS_ID',
  'SITE_URL'
]

const missingVars = requiredVars.filter(varName => 
  !envContent.includes(`${varName}=`)
)

if (missingVars.length > 0) {
  console.log('⚠️  Missing environment variables:')
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`)
  })
  console.log('\n📝 Add these to your .env file:')
  console.log('GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX')
  console.log('SITE_URL=https://wecodezw.com\n')
} else {
  console.log('✅ All required environment variables found!')
}

console.log('📋 Next steps:')
console.log('1. Set up Google Analytics 4 and get your Measurement ID')
console.log('2. Add your site to Google Search Console')
console.log('3. Update public/google-site-verification.html with your verification code')
console.log('4. Deploy your site')
console.log('5. Verify ownership in Search Console')
console.log('6. Submit your sitemap: https://wecodezw.com/sitemap.xml')

console.log('\n🎯 SEO Features Ready:')
console.log('✅ Sitemap: /sitemap.xml')
console.log('✅ Robots.txt: /robots.txt')
console.log('✅ Structured Data: JSON-LD')
console.log('✅ Meta Tags: Open Graph, Twitter Cards')
console.log('✅ Analytics: Google Analytics 4')
console.log('✅ PWA: Web App Manifest')