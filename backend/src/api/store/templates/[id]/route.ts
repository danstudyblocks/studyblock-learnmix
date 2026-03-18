import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product";
import DigitalProductModuleService from "@/modules/digital-product/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

/**
 * GET /store/templates/:id
 * Returns a single template by id (for share links and modal open from URL).
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

    const digitalProducts =
      await digitalProductModuleService.listDigitalProducts();
    const product = (digitalProducts || []).find(
      (dp: any) => dp.id === templateId && dp?.isTemplate && dp?.template_data
    );

    if (!product) {
      return res.status(404).json({ message: "Template not found" });
    }

    const template = {
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail,
      tags: product.tags,
      category_top: product.category_top,
      category_sub: product.category_sub,
      creator_id: product.creator_id,
      is_premium: !!product.is_premium,
      template_data: product.template_data,
      show_in_studio: product.show_in_studio,
      isTemplate: product.isTemplate,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };

    res.json({ template });
  } catch (error) {
    console.error("Error fetching template:", error);
    return res.status(500).json({
      message: "Failed to fetch template",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
