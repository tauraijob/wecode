# Paynow Payment Flow

## Complete Payment Flow

### When User Clicks "Enroll Now" on a Course:

1. **Enrollment Request**
   - User clicks "Enroll Now" button on course page (`/courses/[id]`)
   - Frontend calls `/api/courses/[id]/enroll` (POST)

2. **Invoice Creation**
   - System creates an invoice with status `SENT`
   - System creates an enrollment with status `PENDING` (for paid courses) or `ACTIVE` (for free courses)
   - Invoice is linked to the enrollment

3. **Paynow Payment Initiation** (for paid courses only)
   - System initiates Paynow payment using:
     - Invoice number as reference
     - Course name and price
     - User's email (or `PAYNOW_TEST_EMAIL` if in test mode)
   - Paynow returns a `redirectUrl`

4. **Redirect to Paynow**
   - User is automatically redirected to Paynow payment page
   - Paynow shows payment form where user can:
     - Select payment method (Ecocash, OneMoney, Bank transfer, etc.)
     - Enter payment details (phone number, account details, etc.)
     - Complete the payment

5. **Payment Processing**
   - User completes payment on Paynow
   - Paynow processes the payment

6. **Webhook Notification** (Backend)
   - Paynow sends webhook to `/api/paynow/result`
   - System verifies the payment status
   - If payment is successful:
     - Updates invoice status to `PAID`
     - Creates payment record
     - Updates enrollment status from `PENDING` to `ACTIVE`

7. **User Redirect**
   - Paynow redirects user back to your site using `returnUrl`
   - User is redirected to `/dashboard/learn` (My Courses page)
   - User sees the course in their "My Courses" list with `ACTIVE` status

### For Free Courses:

- No payment required
- Enrollment is immediately set to `ACTIVE`
- User is redirected directly to the course page

## Configuration

### Environment Variables Required:

```env
PAYNOW_INTEGRATION_ID=22658
PAYNOW_INTEGRATION_KEY=a5651864-acc3-478f-b093-3a8e8c4f7dd7
SITE_URL=http://localhost:3000  # or https://wecode.co.zw for production
PAYNOW_TEST_EMAIL=your-registered-email@example.com  # Required for test mode
```

### Paynow Dashboard Configuration:

- **Result URL (Webhook):** `{SITE_URL}/api/paynow/result`
  - This is where Paynow sends payment status updates
  - Must be publicly accessible (use ngrok for local testing)

- **Return URL:** `{SITE_URL}/dashboard/learn`
  - This is where users are redirected after payment
  - Currently set to "My Courses" page

## Flow Diagram

```
User clicks "Enroll Now"
    ↓
Create Invoice & Enrollment (PENDING)
    ↓
Initiate Paynow Payment
    ↓
Redirect to Paynow Payment Page
    ↓
User enters payment details on Paynow
    ↓
User completes payment
    ↓
Paynow processes payment
    ↓
Paynow sends webhook to /api/paynow/result
    ↓
System updates: Invoice → PAID, Enrollment → ACTIVE
    ↓
Paynow redirects user to /dashboard/learn
    ↓
User sees course in "My Courses" with ACTIVE status
```

## Testing

### Test Mode Requirements:

- In test mode, the email used must match the merchant's registered email in Paynow dashboard
- Set `PAYNOW_TEST_EMAIL` in your `.env` file
- Use test payment methods provided by Paynow

### Manual Testing:

1. Enroll in a paid course
2. You should be redirected to Paynow
3. Use Paynow test payment methods
4. Complete payment
5. You should be redirected back to "My Courses"
6. Course should show as `ACTIVE` status

## Troubleshooting

### Payment not activating enrollment:

- Check webhook URL is accessible
- Check server logs for webhook errors
- Verify Paynow dashboard has correct webhook URL configured
- Check that invoice number matches between enrollment and payment

### User not redirected after payment:

- Verify `returnUrl` is correctly set in enrollment endpoint
- Check Paynow dashboard return URL configuration
- Ensure `SITE_URL` environment variable is correct



