import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import Stripe from "stripe";

/**
 * Called after Stripe checkout redirect. Verifies the session and updates
 * customer metadata to Pro so the UI shows the badge without waiting for webhook.
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const customerId = req.auth_context?.actor_id;
    if (!customerId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ success: false, message: "Stripe not configured" });
    }

    const body = req.body as { session_id?: string };
    const sessionId = body?.session_id;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Missing session_id" });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-12-18.acacia" });
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.payment_status !== "paid" || session.mode !== "subscription") {
      return res.status(400).json({ success: false, message: "Invalid or unpaid session" });
    }

    const metaCustomerId = session.metadata?.customer_id;
    if (metaCustomerId !== customerId) {
      return res.status(403).json({ success: false, message: "Session does not match customer" });
    }

    const subscriptionId = typeof session.subscription === "string"
      ? session.subscription
      : (session.subscription as Stripe.Subscription)?.id;

    const customerModule = req.scope.resolve(Modules.CUSTOMER);
    const existing = await customerModule.retrieveCustomer(customerId);
    const existingMeta = (existing?.metadata as Record<string, unknown>) || {};
    await customerModule.updateCustomers(customerId, {
      metadata: {
        ...existingMeta,
        isPremium: true,
        subscriptionId: subscriptionId || undefined,
        subscriptionStatus: "active",
      },
    });

    return res.json({ success: true, isPremium: true });
  } catch (error: any) {
    console.error("Subscription success error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm subscription",
    });
  }
};
