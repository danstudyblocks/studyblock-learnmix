import { MedusaContainer } from '@medusajs/framework/types'
import { createMedusaContainer } from '@medusajs/framework/utils'
import dailyPayoutsJob from '@/jobs/daily-payouts'

/**
 * Test script to manually run the daily payouts job
 * Usage: npx ts-node src/scripts/test-daily-payouts.ts
 */

async function testDailyPayouts() {
  console.log('🧪 [TEST] Starting manual daily payouts job...')
  
  try {
    // Create container (you might need to adjust this based on your setup)
    const container = await createMedusaContainer()
    
    // Run the daily payouts job
    await dailyPayoutsJob(container)
    
    console.log('✅ [TEST] Daily payouts job completed successfully')
  } catch (error) {
    console.error('❌ [TEST] Daily payouts job failed:', error)
  }
}

// Run the test
testDailyPayouts()

