import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import Stripe from "stripe";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;

    if (!stripeSecretKey) {
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured. Please contact support.",
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
    });

    const customerId = req.auth_context?.actor_id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Get customer info
    const customerModule = req.scope.resolve("customer");
    const customer = await customerModule.retrieveCustomer(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Learnmix Pro Subscription",
              description: "Unlimited access to all Pro templates and resources",
            },
            unit_amount: 999, // $9.99 per month
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      // Always redirect to /profile (not /account) so Pro badge and subscription state can be confirmed
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:8000"}/profile?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:8000"}/profile?subscription=cancelled`,
      customer_email: customer.email,
      metadata: {
        customer_id: customerId,
      },
    });

    return res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};
