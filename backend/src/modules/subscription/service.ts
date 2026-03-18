import { MedusaService } from "@medusajs/framework/utils"
import Subscription from "./models/subscription";
import { 
  CreateSubscriptionData, 
  SubscriptionData, 
  SubscriptionInterval, 
  SubscriptionStatus
} from "./types";
import moment from "moment";
import Stripe from 'stripe';

class SubscriptionModuleService extends MedusaService({
  Subscription
}) {
  stripe: Stripe;

  constructor(container) {
    super(container);
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2025-03-31.basil' // Use the latest API version
    });
  }
  // @ts-expect-error
  async createSubscriptions(
    data: CreateSubscriptionData | CreateSubscriptionData[]
  ): Promise<SubscriptionData[]> {
    const input = Array.isArray(data) ? data : [data]

    const subscriptions = await Promise.all(
      input.map(async (subscription) => {
        const subscriptionDate = subscription.subscription_date || new Date()
        const expirationDate = this.getExpirationDate({
          subscription_date: subscriptionDate,
          interval: subscription.interval,
          period: subscription.period
        })

        return await super.createSubscriptions({
          ...subscription,
          subscription_date: subscriptionDate,
          last_order_date: subscriptionDate,
          next_order_date: this.getNextOrderDate({
            last_order_date: subscriptionDate,
            expiration_date: expirationDate,
            interval: subscription.interval,
            period: subscription.period
          }),
          expiration_date: expirationDate
        })
      })
    )
    
    return subscriptions
  }

  async recordNewSubscriptionOrder(id: string) {
    const subscription = await this.retrieveSubscription(id)

    const orderDate = new Date()

    return await this.updateSubscriptions({
      id,
      last_order_date: orderDate,
      next_order_date: this.getNextOrderDate({
        last_order_date: orderDate,
        expiration_date: subscription.expiration_date,
        interval: subscription.interval,
        period: subscription.period
      })
    })
  }

  async expireSubscription(id: string | string[]): Promise<SubscriptionData[]> {
    const input = Array.isArray(id) ? id : [id]

    return await this.updateSubscriptions({
      selector: {
        id: input
      },
      data: {
        next_order_date: null,
        status: SubscriptionStatus.EXPIRED
      }
    })
  }

  async cancelSubscriptions(
    id: string | string[]): Promise<SubscriptionData[]> {
    const input = Array.isArray(id) ? id : [id]

    return await this.updateSubscriptions({
      selector: {
        id: input
      },
      data: {
        next_order_date: null,
        status: SubscriptionStatus.CANCELED
      }
    })
  }

  getNextOrderDate({
    last_order_date,
    expiration_date,
    interval,
    period
  }: {
    last_order_date: Date
    expiration_date: Date
    interval: SubscriptionInterval,
    period: number
  }): Date | null {
    const nextOrderDate = moment(last_order_date)
      .add(
        period, 
        interval === SubscriptionInterval.MONTHLY ? 
          "month" : "year"
      )
    const expirationMomentDate = moment(expiration_date)

    // if next order date is after the expiration date, return
    // null. Otherwise, return the next order date.
    return nextOrderDate.isAfter(expirationMomentDate) ? 
      null : nextOrderDate.toDate()
  }

  getExpirationDate({
    subscription_date,
    interval,
    period
  }: {
    subscription_date: Date,
    interval: SubscriptionInterval,
    period: number
  }) {
    return moment(subscription_date)
      .add(
        period,
        interval === SubscriptionInterval.MONTHLY ?
          "month" : "year"
      ).toDate()
  }

    /**
   * Create a Stripe checkout session for subscription
   */
    async createStripeCheckoutSession({
      priceId,
      customerId,
      metadata = {},
      successUrl,
      cancelUrl,
      email
    }: {
      priceId: string;
      customerId?: string;
      metadata?: Record<string, any>;
      successUrl: string;
      cancelUrl: string;
      email?: string;
    }) {
      try {
        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer_email: email,
          client_reference_id: customerId,
          metadata: {
            ...metadata,
            customerId,
          }
        });
  
        return {
          sessionId: session.id,
          url: session.url
        };
      } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
      }
    }
  
    /**
     * Process a subscription from a completed Stripe checkout session
     */
    async processStripeCheckoutSession(sessionId: string) {
      try {
        // Retrieve the session details from Stripe
        const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['subscription']
        });
    
        if (!session.subscription) {
          throw new Error('No subscription found in checkout session');
        }
    
        const subscription = session.subscription as Stripe.Subscription;
        const customerId = session.client_reference_id;
    
        const stripePlan = subscription.items.data[0].plan;
        const interval = stripePlan.interval === 'month' 
          ? SubscriptionInterval.MONTHLY 
          : SubscriptionInterval.YEARLY;
        const period = stripePlan.interval_count || 1;
    
        // ✅ Check if subscription already exists before creating it
        const existing = await this.retrieveSubscription(subscription.id).catch(() => null);
        if (existing) {
          return existing;
        }
    
        // 🆕 Create a subscription
        const subscriptionData = await this.createSubscriptions({
          //@ts-ignore
          id: subscription.id,
          status: SubscriptionStatus.ACTIVE,
          interval: interval,
          period: period,
          metadata: {
            stripeSubscriptionId: subscription.id,
            stripePlanId: stripePlan.id,
            stripeCustomerId: subscription.customer as string,
            userId: customerId,
          }
        });
    
        return subscriptionData;
      } catch (error) {
        console.error('Error processing checkout session:', error);
        throw error;
      }
    }
    
  
    /**
     * Handle a Stripe webhook event
     */
    async handleStripeWebhookEvent(event: Stripe.Event) {
      try {
        switch (event.type) {
          case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.mode === 'subscription' && session.subscription) {
              await this.processStripeCheckoutSession(session.id);
            }
            break;
          }
          
          case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            
            // Map Stripe status to your system's status
            let status: SubscriptionStatus;
            switch (subscription.status) {
              case 'active':
                status = SubscriptionStatus.ACTIVE;
                break;
              case 'canceled':
                status = SubscriptionStatus.CANCELED;
                break;
              case 'past_due':
              case 'unpaid':
                status = SubscriptionStatus.EXPIRED;
                break;
              default:
                status = SubscriptionStatus.ACTIVE;
            }
            
            // Update the subscription in your system
            await this.updateSubscriptions({
              id: subscription.id,
              status: status
            });
            break;
          }
          
          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            await this.cancelSubscriptions(subscription.id);
            break;
          }
        }
        
        return { success: true };
      } catch (error) {
        console.error('Error handling webhook event:', error);
        throw error;
      }
    }
  }
  
  export default SubscriptionModuleService