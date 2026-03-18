//@ts-nocheck
import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product";
import DigitalProductModuleService from "@/modules/digital-product/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const digitalProductModuleService = req.scope.resolve(DIGITAL_PRODUCT_MODULE) as DigitalProductModuleService;
        const products = await digitalProductModuleService.listDigitalProducts();

        // Aggregate unique top_categories and sub_categories
        const topCategoriesSet = new Set<string>();
        const subCategoriesSet = new Set<string>();

        products.forEach(product => {
            if (product.category_top) topCategoriesSet.add(product.category_top);
            if (product.category_sub) subCategoriesSet.add(product.category_sub);
        });

        const top_categories = Array.from(topCategoriesSet);
        const sub_categories = Array.from(subCategoriesSet);

        res.json({
            top_categories,
            sub_categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: error.message });
    }
};
