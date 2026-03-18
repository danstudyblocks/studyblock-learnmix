import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { completeCartWorkflow } from "@medusajs/medusa/core-flows";
import createDigitalProductOrderWorkflow from "../../../../../workflows/create-digital-product-order";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const logger = req.scope.resolve("logger");
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const cartId = req.params.id;

  // Check if cart contains print orders (digital products with print_order metadata)
  const { data: carts } = await query.graph({
    entity: "cart",
    fields: ["id", "items.*", "items.metadata"],
    filters: { id: cartId }
  });

  const cart = carts?.[0];
  const hasPrintOrders = cart?.items?.some((item: any) => 
    item.metadata?.print_order !== undefined
  );

  // If cart has print orders, use standard cart completion (which should work without shipping)
  // Otherwise, use digital product workflow
  if (hasPrintOrders) {
    logger.info(`Completing cart ${cartId} with print orders`);
    const { result } = await completeCartWorkflow(req.scope).run({
      input: {
        id: cartId
      }
    });

    res.json({
      type: "order",
      order: result
    });
  } else {
    // Use digital product workflow for other digital products
    const { result } = await createDigitalProductOrderWorkflow(req.scope)
      .run({
        input: {
          cart_id: cartId
        }
      });

    res.json({
      type: "order",
      ...result
    });
  }
}