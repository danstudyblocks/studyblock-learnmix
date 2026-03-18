import Stripe from 'stripe'

/**
 * Script to add test funds to Stripe account
 * Usage: npx ts-node src/scripts/add-stripe-test-funds.ts
 */

async function addTestFunds() {
  // Replace with your test secret key
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    //@ts-ignore
    apiVersion: '2025-02-24.acacia'
  })

  try {
    console.log('💰 Adding test funds to Stripe account...')

    // First, create a payment method with the test card
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4000000000000077',
        exp_month: 12,
        exp_year: 2025,
        cvc: '123'
      }
    })

    console.log('💳 Payment method created:', paymentMethod.id)

    // Create a payment intent with the payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // €50.00 in cents
      currency: 'eur',
      payment_method: paymentMethod.id,
      confirmation_method: 'manual',
      confirm: true,
      description: 'Test funds for payout testing'
    })

    console.log('✅ Test funds added successfully!')
    console.log('Payment Intent ID:', paymentIntent.id)
    console.log('Amount:', paymentIntent.amount / 100, 'EUR')
    console.log('Status:', paymentIntent.status)

    // Check current balance
    const balance = await stripe.balance.retrieve()
    console.log('💰 Current balance:')
    console.log('Available:', balance.available[0]?.amount / 100, balance.available[0]?.currency)
    console.log('Pending:', balance.pending[0]?.amount / 100, balance.pending[0]?.currency)

  } catch (error) {
    console.error('❌ Error adding test funds:', error)
  }
}

// Run the script
addTestFunds()
