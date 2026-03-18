import Stripe from 'stripe'

/**
 * Simple script to add test funds using pre-made test tokens
 * Usage: npx ts-node src/scripts/add-funds-simple.ts
 */

async function addFundsSimple() {
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    //@ts-ignore
    apiVersion: '2025-02-24.acacia'
  })

  try {
    console.log('💰 Adding test funds using pre-made test tokens...')

    // Use pre-made test tokens that add funds
    const testTokens = [
      'tok_visa',           // Visa test token
      'tok_visa_debit',     // Visa Debit test token
      'tok_mastercard',     // Mastercard test token
    ]

    for (const token of testTokens) {
      try {
        console.log(`💳 Trying token: ${token}`)
        
        const charge = await stripe.charges.create({
          amount: 2000, // €20.00 in cents
          currency: 'eur',
          source: token,
          description: `Test funds - ${token}`
        })

        console.log(`✅ Success with ${token}:`, charge.id)
        break // Stop after first successful charge
      } catch (error: any) {
        console.log(`❌ Failed with ${token}:`, error.message)
      }
    }

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
addFundsSimple()
