import { Modules } from "@medusajs/utils";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";

export default async function orderPaymentCapturedHandler({
    event: { data },
    container,
}: SubscriberArgs<any>) {
    const paymentModuleService = container.resolve(Modules.PAYMENT);
    const orderModuleService = container.resolve(Modules.ORDER);
    const logger = container.resolve("logger");

    try {
        logger.info("Starting payment.captured event processing...");

        const paymentId = data?.id; // payment id from event data
        if (!paymentId) {
            logger.error("Payment ID not found in event data.");
            throw new Error("Payment ID not found.");
        }

        // Use listPayments to find the payment by ID
        logger.info(`Retrieving payment details for ID: ${paymentId}`);
        const payments = await paymentModuleService.listPayments({
            id: [paymentId], // Correctly pass payment ID as an array
        });

        if (payments.length === 0) {
            logger.error(`Payment not found for ID: ${paymentId}`);
            throw new Error("Payment not found.");
        }

        const payment = payments[0];
        logger.info(`Payment retrieved: ${JSON.stringify(payment)}`);
        const { amount, currency_code, order_id } = payment;

        if (!order_id) {
            logger.error("Order ID is missing in the payment.");
            throw new Error("Order ID missing in payment.");
        }

        // Retrieve the associated order
        logger.info(`Retrieving order details for ID: ${order_id}`);
        const order = await orderModuleService.retrieveOrder(order_id, {
            relations: ["items", "summary", "shipping_address"],
        });

        if (!order) {
            logger.error(`Order not found for ID: ${order_id}`);
            throw new Error("Order not found.");
        }

        logger.info(`Order retrieved: ${JSON.stringify(order)}`);


        const platformCommissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.3');
        //@ts-ignore
        const platformShare = amount * platformCommissionRate;
        //@ts-ignore
        const vendorShare = amount - platformShare;

        // Log the results of the calculation
        logger.info(`Payment processed for Order ID: ${order_id}`);
        logger.info(`Total Amount: ${amount} ${currency_code}`);
        logger.info(`Platform Share: ${platformShare} ${currency_code}`);
        logger.info(`Vendor Share: ${vendorShare} ${currency_code}`);

        // Optional: store these details in a database or send notifications
        // Example: Save the payment split to a database or notify the vendor and platform
        // Prepare the update data for order change metadata
        const updateData = {
            metadata: {
                    platform_share: platformShare,
                    vendor_share: vendorShare,
                    currency: currency_code,
                    paymentId,
                    amount 
            },
        };

        // Assuming you are adding a new order change with this metadata
        const updatedOrderChange = await orderModuleService.updateOrders(order_id,updateData);

        logger.info(`Payment split saved in order change metadata for ${order_id}`);
    } catch (error) {
        logger.error("Error processing payment captured event:", error);
    }
}

export const config: SubscriberConfig = {
    event: 'payment.payment_captured',
};
