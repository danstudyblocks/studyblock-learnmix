//@ts-nocheck
import { SUBSCRIPTION_MODULE } from "@/modules/subscription";
import {
    AuthenticatedMedusaRequest,
    MedusaResponse
} from "@medusajs/framework";
import { Modules } from "@medusajs/utils";

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ error: 'Missing session ID' });
        }

        // Get the subscription service
        const subscriptionService = req.scope.resolve(SUBSCRIPTION_MODULE);

        // Process the checkout session
        const subscription = await subscriptionService.processStripeCheckoutSession(session_id as string);
        console.log("subscription data:",subscription)
        const customerId = subscription?.metadata?.userId
        // Update customer metadata if needed
        const customerService = req.scope.resolve(Modules.CUSTOMER);
        await customerService.updateCustomers(customerId, {
            metadata: {
                subscriptionId: subscription.id,
                isPremium: true
            }
        });

        res.json({ success: true, subscription });
    } catch (error) {
        console.error('Error processing subscription success:', error);
        res.status(500).json({
            error: "Failed to process subscription",
            message: error.message
        });
    }
}