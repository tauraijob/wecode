# Paynow Integration Setup

## Integration Details

**Company:** Tau Digital Investments  
**Type:** 3rd Party Integration  
**Payment Link:** WeCodeZW USD  
**Integration ID:** `22658`  
**Integration Key:** `a5651864-acc3-478f-b093-3a8e8c4f7dd7`

## Environment Variables

### For Production (Live Payments):

```env
PAYNOW_INTEGRATION_ID=22658
PAYNOW_INTEGRATION_KEY=a5651864-acc3-478f-b093-3a8e8c4f7dd7
SITE_URL=https://wecode.co.zw
# PAYNOW_TEST_EMAIL is NOT needed for live payments - system uses user's email
```

### For Test Mode (if still testing):

```env
PAYNOW_INTEGRATION_ID=22658
PAYNOW_INTEGRATION_KEY=a5651864-acc3-478f-b093-3a8e8c4f7dd7
SITE_URL=https://wecode.co.zw
PAYNOW_TEST_EMAIL=taujob1111@gmail.com  # Only needed in test mode
```

### For Local Development:

```env
PAYNOW_INTEGRATION_ID=22658
PAYNOW_INTEGRATION_KEY=a5651864-acc3-478f-b093-3a8e8c4f7dd7
SITE_URL=http://localhost:3000
# PAYNOW_TEST_EMAIL only if integration is in test mode
```

**Important Notes:**
- **Live/Production Payments:** The system automatically uses the user's actual email address. No `PAYNOW_TEST_EMAIL` needed.
- **Test Mode:** If your Paynow integration is still in test mode, you must set `PAYNOW_TEST_EMAIL` to match the merchant's registered email address in your Paynow dashboard.
- **Webhooks:** Paynow webhooks require a publicly accessible URL. For local testing, use ngrok or test on staging/production.

## Webhook Configuration

In your Paynow dashboard, configure the following webhook URL:

**Result URL (Webhook):** `{SITE_URL}/api/paynow/result`

This endpoint will be called by Paynow when payment status changes. It will:
- Update the invoice status to `PAID`
- Create a payment record
- Activate the enrollment(s) linked to the invoice

**Return URL:** `{SITE_URL}/pay/{invoiceNumber}`

This is where users are redirected after completing payment on Paynow.

## Testing

1. Make sure the environment variables are set
2. Enroll in a course to generate an invoice
3. Click "Pay with Paynow" on the payment page
4. Complete the payment on Paynow
5. The webhook will automatically update the invoice and activate the enrollment

## Manual Payment Confirmation (Development Only)

For testing without actual payment, use the "Mark as Paid (Dev Only)" button on the payment page. This calls `/api/payments/course-webhook` to simulate a successful payment.

