import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product";
import DigitalProductModuleService from "@/modules/digital-product/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const digitalProductModuleService = req.scope.resolve(
      DIGITAL_PRODUCT_MODULE
    ) as DigitalProductModuleService;

    const digitalProducts =
      await digitalProductModuleService.listDigitalProducts();

    const miniTemplates = digitalProducts
      .filter(
        (product) =>
          product?.isTemplate === true &&
          product?.template_data &&
          (product.category_top?.toLowerCase() === "blocks" ||
            product.category_sub?.toLowerCase() === "blocks" ||
            product.tags?.some((tag: string) =>
              tag?.toLowerCase?.()?.includes("block")
            ))
      )
      .map((product) => ({
        id: product.id,
        name: product.name,
        thumbnail: product.thumbnail,
        tags: product.tags,
        category_top: product.category_top,
        category_sub: product.category_sub,
        creator_id: product.creator_id,
        is_premium: product.is_premium,
        template_data: product.template_data,
        show_in_studio: product.show_in_studio,
        isTemplate: product.isTemplate,
        created_at: product.created_at,
        updated_at: product.updated_at,
      }))
      .sort((a, b) => {
        // Sort by created_at descending (most recent first)
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

    res.json(miniTemplates);
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to fetch mini templates: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
  }
};
