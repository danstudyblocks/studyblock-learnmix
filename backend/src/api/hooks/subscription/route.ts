import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import Stripe from 'stripe';
import { SUBSCRIPTION_MODULE } from "@/modules/subscription";
import SubscriptionModuleService from "@/modules/subscription/service";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    try {
        // Get the raw request body from Medusa's request object
        const rawBody = req.rawBody;
        const signature = req.headers['stripe-signature'] as string;

        if (!rawBody) {
            return res.status(400).json({ error: 'Missing request body' });
        }

        if (!signature) {
            return res.status(400).json({ error: 'Missing stripe-signature header' });
        }

        let event: Stripe.Event;

        // Verify the webhook signature
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                signature,
                webhookSecret
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error(`Webhook signature verification failed: ${errorMessage}`);
            return res.status(400).json({ error: `Webhook Error: ${errorMessage}` });
        }

        // Get the subscription service
        const subscriptionService = req.scope.resolve<SubscriptionModuleService>(SUBSCRIPTION_MODULE);

        // Handle the event
        const result = await subscriptionService.handleStripeWebhookEvent(event);

        res.json({ received: true, ...result });
    } catch (error) {
        console.error('Webhook error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ 
            error: 'Webhook handler failed', 
            message: errorMessage 
        });
    }
};