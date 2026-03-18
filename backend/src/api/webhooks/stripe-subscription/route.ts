import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import Stripe from "stripe";
import { Modules } from "@medusajs/framework/utils";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error("Stripe webhook: Missing configuration");
    return res.status(400).json({ error: "Stripe not configured" });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-12-18.acacia",
  });

  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).json({ error: "No signature" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  const customerModule = req.scope.resolve(Modules.CUSTOMER);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === "subscription" && session.metadata?.customer_id) {
          const customerId = session.metadata.customer_id;
          const subscriptionId = session.subscription as string;

          // Update customer metadata to mark as Pro
          await customerModule.updateCustomers(customerId, {
            metadata: {
              isPremium: true,
              subscriptionId: subscriptionId,
              subscriptionStatus: "active",
            },
          });

          console.log(`Customer ${customerId} upgraded to Pro`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find customer by subscription ID
        const customers = await customerModule.listCustomers({
          metadata: {
            subscriptionId: subscription.id,
          },
        });

        if (customers.length > 0) {
          const customer = customers[0];
          
          await customerModule.updateCustomers(customer.id, {
            metadata: {
              ...customer.metadata,
              subscriptionStatus: subscription.status,
              isPremium: subscription.status === "active",
            },
          });

          console.log(`Subscription ${subscription.id} updated to ${subscription.status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find customer by subscription ID
        const customers = await customerModule.listCustomers({
          metadata: {
            subscriptionId: subscription.id,
          },
        });

        if (customers.length > 0) {
          const customer = customers[0];
          
          await customerModule.updateCustomers(customer.id, {
            metadata: {
              ...customer.metadata,
              isPremium: false,
              subscriptionStatus: "cancelled",
            },
          });

          console.log(`Subscription ${subscription.id} cancelled for customer ${customer.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: error.message });
  }
};
