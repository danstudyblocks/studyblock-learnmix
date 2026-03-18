//@ts-nocheck
import { SUBSCRIPTION_MODULE } from "@/modules/subscription";
import {
    AuthenticatedMedusaRequest,
    MedusaResponse
} from "@medusajs/framework";

export const POST = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        console.log(req,"req subscription")
        const body = await req.body
        const { priceId, successUrl, cancelUrl, creator_id, email } = body;

        // Get the subscription service
        const subscriptionService = req.scope.resolve(SUBSCRIPTION_MODULE);

        // Create a checkout session
        const checkoutSession = await subscriptionService.createStripeCheckoutSession({
            priceId,
            customerId: creator_id,
            email: email,
            successUrl: successUrl || `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: cancelUrl || `${process.env.FRONTEND_URL}/subscription/cancel`,
            metadata: {
                userId: creator_id
            }
        });
        console.log("checkoutsession:", checkoutSession)
        res.json(checkoutSession);
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({
            error: "Failed to create checkout session",
            message: error.message
        });
    }
}