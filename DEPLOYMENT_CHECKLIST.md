# Production Deployment Checklist - wecode.co.zw

## PayNow Configuration

### ✅ Environment Variables Required

Make sure these are set in your production environment:

```env
# PayNow Integration
PAYNOW_INTEGRATION_ID=22658
PAYNOW_INTEGRATION_KEY=a5651864-acc3-478f-b093-3a8e8c4f7dd7
SITE_URL=https://wecode.co.zw

# AI Quiz Generation (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key_here
# Get your free API key at: https://aistudio.google.com/app/apikey

# Email Configuration (Brevo)
BREVO_SMTP_USER=your_brevo_smtp_user
BREVO_SMTP_KEY=your_brevo_smtp_key
MAIL_FROM=info@wecode.co.zw

# Database
DATABASE_URL=your_production_database_url

# Other required env vars
NODE_ENV=production
```

### ✅ PayNow Dashboard Configuration

**IMPORTANT:** Configure these URLs in your PayNow dashboard:

1. **Result URL (Webhook):** 
   ```
   https://wecode.co.zw/api/paynow/result
   ```
   - This is where PayNow sends payment status updates
   - Must be publicly accessible
   - Handles both GET and POST requests

2. **Return URL:** 
   ```
   https://wecode.co.zw/dashboard/learn
   ```
   - This is where users are redirected after payment
   - Can also be invoice-specific: `https://wecode.co.zw/invoices/{invoiceId}`

### ✅ PayNow URLs Generated

The system will automatically generate these URLs based on `SITE_URL`:

- **Result URL:** `https://wecode.co.zw/api/paynow/result`
- **Return URL:** `https://wecode.co.zw/dashboard/learn` (default)
- **Invoice Return URL:** `https://wecode.co.zw/invoices/{invoiceId}` (when paying from invoice page)

### ✅ Code Updates Made

1. **`server/api/paynow.initiate.post.ts`**
   - Uses `SITE_URL` environment variable
   - Defaults to `https://wecode.co.zw` in production
   - Constructs resultUrl and returnUrl dynamically

2. **`server/api/courses/[id]/enroll.post.ts`**
   - Uses `SITE_URL` environment variable
   - Defaults to `https://wecode.co.zw` in production
   - Constructs PayNow URLs dynamically

3. **`pages/invoices/[id].vue`**
   - Uses `window.location.origin` for return URL (automatically uses correct domain)

### ✅ Testing Checklist

Before going live, test:

1. [ ] Environment variables are set correctly
2. [ ] PayNow dashboard has correct webhook URL configured
3. [ ] Test a payment flow:
   - [ ] Enroll in a course
   - [ ] Click "Pay Now"
   - [ ] Complete payment on PayNow
   - [ ] Verify redirect back to site works
   - [ ] Verify webhook updates invoice status
   - [ ] Verify enrollment is activated
4. [ ] Test invoice payment:
   - [ ] Go to invoice page
   - [ ] Click "Pay Now"
   - [ ] Complete payment
   - [ ] Verify redirect back to invoice page
   - [ ] Verify invoice shows as PAID

### ✅ Production Notes

- **Webhooks:** PayNow webhooks will work automatically in production since `https://wecode.co.zw/api/paynow/result` is publicly accessible
- **Email Verification:** Email verification links will use `https://wecode.co.zw` automatically
- **No Test Email Needed:** In production, remove `PAYNOW_TEST_EMAIL` - system uses user's actual email

### ⚠️ Important Reminders

1. **SSL Certificate:** Ensure `https://wecode.co.zw` has a valid SSL certificate
2. **Firewall:** Ensure webhook endpoint `/api/paynow/result` is accessible from PayNow servers
3. **Logs:** Monitor server logs for PayNow webhook calls
4. **Database:** Run migrations before deploying:
   ```bash
   npx prisma migrate deploy
   ```

## Email Verification

Email verification links will automatically use:
- `https://wecode.co.zw/api/auth/verify-email?token={token}`

Make sure Brevo is configured with:
- `MAIL_FROM=info@wecode.co.zw` (or your verified sender email)

