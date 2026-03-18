import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product";
import DigitalProductModuleService from "@/modules/digital-product/service";

/**
 * GET /store/templates/:id/creator
 * Returns creator (customer) info for a template. Used when displaying a template modal.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const templateId = req.params.id;
    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    const digitalProductModuleService = req.scope.resolve(
      DIGITAL_PRODUCT_MODULE
    ) as DigitalProductModuleService;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const digitalProducts =
      await digitalProductModuleService.listDigitalProducts();
    const template = (digitalProducts || []).find(
      (dp: any) => dp.id === templateId
    );

    if (!template?.creator_id) {
      return res.json({ customer: null });
    }

    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name", "last_name", "metadata"],
      filters: { id: template.creator_id },
    });

    const customer = customers?.[0] ?? null;
    return res.json({ customer });
  } catch (error) {
    console.error("Error fetching template creator:", error);
    return res.status(500).json({
      message: "Failed to fetch template creator",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
