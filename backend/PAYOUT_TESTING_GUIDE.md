# Payout System Testing Guide

## 🧪 Testing Your Payout Flow

### Prerequisites
1. ✅ Product created and linked to customer (vendor)
2. ✅ Order placed with successful payment
3. ✅ Order status updated to "delivered"
4. ✅ Vendor has Stripe Connect account set up

---

## 🚀 Testing Methods

### Method 1: Manual Payout Trigger (Recommended)

**Step 1: Get your Order ID**
```bash
# Check your orders in the database or Medusa dashboard
# Note down the order ID that you want to test
```

**Step 2: Trigger payout manually**
```bash
# Using curl
curl -X POST http://localhost:9000/admin/test-payout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"order_id": "YOUR_ORDER_ID"}'

# Or using the Medusa admin dashboard
# Navigate to: Admin Dashboard > Settings > API Endpoints
# Test the POST /admin/test-payout endpoint
```

**Step 3: Check results**
```bash
# Check payout history for the vendor
curl -X GET http://localhost:8000/vendor/payouts \
  -H "Authorization: Bearer VENDOR_TOKEN"
```

### Method 2: Run Daily Payout Job Manually

**Step 1: Run the test script**
```bash
cd backend
npx ts-node src/scripts/test-daily-payouts.ts
```

**Step 2: Check logs**
- Look for console output showing orders being processed
- Check for any errors in the payout workflow

### Method 3: Database Verification

**Step 1: Check order_payout table**
```sql
SELECT * FROM order_payout WHERE order_id = 'YOUR_ORDER_ID';
```

**Step 2: Check payout table**
```sql
SELECT * FROM payout WHERE payout_account_id = (
  SELECT payout_account_id FROM customer_payout_account 
  WHERE customer_id = 'YOUR_VENDOR_CUSTOMER_ID'
);
```

**Step 3: Check payout_account table**
```sql
SELECT * FROM payout_account WHERE id = (
  SELECT payout_account_id FROM customer_payout_account 
  WHERE customer_id = 'YOUR_VENDOR_CUSTOMER_ID'
);
```

---

## 🔍 Verification Steps

### 1. Check Vendor's Payout Account
```bash
curl -X GET http://localhost:8000/vendor/payout-account \
  -H "Authorization: Bearer VENDOR_TOKEN"
```

**Expected Response:**
```json
{
  "payout_account": {
    "id": "pacc_xxx",
    "status": "active",
    "reference_id": "acct_xxx",
    "data": { ... }
  }
}
```

### 2. Check Payout History
```bash
curl -X GET http://localhost:8000/vendor/payouts \
  -H "Authorization: Bearer VENDOR_TOKEN"
```

**Expected Response:**
```json
{
  "payouts": [
    {
      "id": "pout_xxx",
      "amount": 7000,  // $70.00 (after 30% commission)
      "currency_code": "usd",
      "status": "paid",
      "created_at": "2024-01-01T00:00:00Z",
      "data": {
        "id": "tr_xxx",  // Stripe transfer ID
        "amount": 7000,
        "currency": "usd"
      }
    }
  ],
  "count": 1,
  "offset": 0,
  "limit": 20
}
```

### 3. Check Stripe Dashboard
1. Go to your Stripe Dashboard
2. Navigate to "Connect" > "Accounts"
3. Find your vendor's account
4. Check "Transfers" section for the payout

---

## 🐛 Troubleshooting

### Common Issues

**1. "No payout account found"**
- Ensure vendor has completed Stripe Connect onboarding
- Check payout_account status is "active"

**2. "Payout already exists for order"**
- The order already has a payout
- Check order_payout table for existing link

**3. "Customer payout account is not active"**
- Vendor needs to complete Stripe Connect setup
- Account status should be "active"

**4. "Stripe API errors"**
- Check Stripe API keys are correct
- Ensure test mode is enabled for localhost
- Check Stripe account has sufficient balance

### Debug Commands

**Check order details:**
```sql
SELECT o.*, c.id as customer_id, c.email 
FROM "order" o 
JOIN customer c ON o.customer_id = c.id 
WHERE o.id = 'YOUR_ORDER_ID';
```

**Check commission calculation:**
```sql
SELECT cl.*, oli.id as order_line_item_id
FROM commission_line cl
JOIN order_line_item oli ON cl.item_line_id = oli.id
JOIN "order" o ON oli.order_id = o.id
WHERE o.id = 'YOUR_ORDER_ID';
```

**Check payout account status:**
```sql
SELECT pa.*, cpa.customer_id
FROM payout_account pa
JOIN customer_payout_account cpa ON pa.id = cpa.payout_account_id
WHERE cpa.customer_id = 'YOUR_VENDOR_CUSTOMER_ID';
```

---

## 📊 Expected Results

### Successful Payout Flow
1. ✅ Order has no existing payout
2. ✅ Vendor has active payout account
3. ✅ Commission calculated correctly (30% platform fee)
4. ✅ Stripe transfer created successfully
5. ✅ Payout linked to order
6. ✅ Payout appears in vendor's history
7. ✅ Transfer visible in Stripe dashboard

### Payout Amount Calculation
```
Order Total: $100.00
Platform Commission (30%): $30.00
Vendor Payout: $70.00
```

---

## 🔧 Localhost vs Production

### Localhost Testing
- ✅ **Works perfectly** with Stripe test mode
- ✅ Uses Stripe test API keys
- ✅ No real money involved
- ✅ Full functionality available

### Production Testing
- ⚠️ Requires real Stripe account
- ⚠️ Uses real money (small amounts)
- ⚠️ Webhooks need proper URL configuration
- ✅ More realistic testing environment

**Recommendation:** Test thoroughly on localhost first, then do final validation on production with small amounts.

---

## 📝 Testing Checklist

- [ ] Product linked to vendor customer
- [ ] Order placed successfully
- [ ] Payment captured
- [ ] Order marked as delivered
- [ ] Vendor has Stripe Connect account
- [ ] Account status is "active"
- [ ] Manual payout trigger works
- [ ] Payout appears in vendor history
- [ ] Stripe transfer created
- [ ] Commission calculated correctly
- [ ] No duplicate payouts
- [ ] Error handling works

---

## 🚨 Important Notes

1. **Stripe Test Mode**: Make sure you're using Stripe test keys for localhost
2. **Webhooks**: Configure Stripe webhooks for localhost using ngrok or similar
3. **Database**: Check your database for proper data integrity
4. **Logs**: Monitor console logs for detailed error messages
5. **Permissions**: Ensure admin tokens have proper permissions

---

## 🎯 Next Steps

After successful testing:
1. Set up production Stripe Connect accounts
2. Configure webhooks for production
3. Set up monitoring and alerts
4. Implement payout analytics
5. Add email notifications