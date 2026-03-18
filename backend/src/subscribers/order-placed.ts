import { Modules } from '@medusajs/utils';
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { EmailTemplates } from '@/modules/email-notifications/templates';
import { INotificationModuleService, IOrderModuleService } from '@medusajs/types';

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve("logger");

  try {
    logger.info("Starting order.placed event processing...");
    logger.info(`Order ID: ${data?.id}`);

    const orderModuleService = container.resolve(Modules.ORDER);
    const customerModuleService = container.resolve(Modules.CUSTOMER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    // Retrieve the order details
    const order = await orderModuleService.retrieveOrder(data.id, { relations: ['items', 'summary'] });

    if (!order) {
      logger.error(`Order not found for ID: ${data.id}`);
      return;
    }

    logger.info(`Order retrieved: ${JSON.stringify(order)}`);

    // Loop through order items to fetch the linked customer for each product
    for (const item of order.items) {
      const { product_id } = item;

      // Fetch the product linked to the order item
      const { data: [product] } = await query.graph({
        entity: "product",
        fields: ["customer.*"],  // Fetch all properties of the customer linked to the product
        filters: {
          id: product_id,  // Filter by product ID
        },
      });

      // If product has a linked customer (vendor)
      if (product && product.customer) {
        const customerId = product.customer.id;
        logger.info(`Found customer(vendor) for product ID: ${product_id}, Customer ID: ${customerId}`);

        const platformCommissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.3');
        //@ts-ignore
        const totalAmount = order.summary.current_order_total > 0 ? order.summary.current_order_total : (order.summary.original_order_total > 0 ? order.summary.original_order_total : order.summary.total);

        const platformShare = totalAmount * platformCommissionRate;
        const vendorShare = totalAmount - platformShare;

        logger.info(`Total Amount: ${totalAmount}`);
        logger.info(`Platform Share: ${platformShare}`);
        logger.info(`Vendor Share: ${vendorShare}`);

        // Retrieve current customer metadata
        const customer = await customerModuleService.retrieveCustomer(customerId);
        const currentEarnings = customer.metadata?.total_earnings || 0;
        const currentOrderCount = customer.metadata?.total_order_count || 0;

        //@ts-ignore Calculate new values for total earnings and total order count
        const updatedEarnings = currentEarnings + vendorShare;
        //@ts-ignore
        const updatedOrderCount = currentOrderCount + 1;

        // Prepare the update data for customer metadata
        const updateCustomerData = {
          metadata: {
            total_earnings: updatedEarnings,
            total_order_count: updatedOrderCount,
          },
        };

        // Update the customer metadata
        await customerModuleService.updateCustomers(customerId, updateCustomerData);
        logger.info(`Customer metadata updated for Customer ID: ${customerId} with earnings: ${updatedEarnings} and order count: ${updatedOrderCount}`);

        // Prepare the update data for order metadata
        const updateOrderData = {
          metadata: {
            platform_share: platformShare,
            vendor_share: vendorShare,
            currency: order.currency_code,
            amount: totalAmount,
            vendorID: customerId
          },
        };

        // Update the order metadata (vendor's order data)
        await orderModuleService.updateOrders(data.id, updateOrderData);

        logger.info(`Payment split saved in order metadata for Customer ID: ${customerId}`);
      } else {
        logger.info(`No customer(vendor) linked to product ID: ${product_id}`);
      }
    }

  } catch (error) {
    logger.error("Error processing order.placed event:", error);
  }

  const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER)

  // Retrieve order - in Medusa v2, retrieveOrder might not accept relations parameter
  // So we'll retrieve it and check shipping_address separately
  const order = await orderModuleService.retrieveOrder(data.id)
  
  // For digital products (print orders), shipping_address might be null
  let shippingAddress = null
  if (order.shipping_address?.id) {
    try {
      shippingAddress = await (orderModuleService as any).orderAddressService_.retrieve(order.shipping_address.id)
    } catch (error: any) {
      logger.warn(`Could not retrieve shipping address for order ${data.id}: ${error?.message || error}`)
    }
  }

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: 'email',
      template: EmailTemplates.ORDER_PLACED,
      data: {
        emailOptions: {
          replyTo: 'dan@studyblocks.ai',
          subject: 'Your order has been placed'
        },
        order,
        shippingAddress,
        preview: 'Thank you for your order!'
      }
    })
  } catch (error) {
    logger.error('Error sending order confirmation notification:', error)
  }
}

export const config: SubscriberConfig = {
  event: 'order.placed',
};
