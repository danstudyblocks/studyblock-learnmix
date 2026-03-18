import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const customer_id = req.params.customer_id

    console.log("params", customer_id)

    try {
        const { data: orders } = await query.graph({
            entity: "order",
            fields: ["*","customer.*","shipping_address.*", "payment_collections.*"],
            filters: {
                metadata: { vendorID: customer_id },
            },
        });

        return res.json({ success: true, orders });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message,
        });
    }
};
