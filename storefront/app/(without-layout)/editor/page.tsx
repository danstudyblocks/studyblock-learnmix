import { Metadata } from "next";
import { getCustomer } from "@/lib/data/customer";
import { getProductsList, getProductsById } from "@/lib/data/products";
import { getCollectionsList } from "@/lib/data/collections";
import { getRegion } from "@/lib/data/regions";
import EditorPage from "@/components/editor-page/EditorPage";

export const metadata: Metadata = {
    title: "Editor - Find the perfect resource | Learnmix",
    description: "Find and create the perfect educational resources with Learnmix editor.",
    keywords: ["editor", "educational resources", "worksheets", "posters", "teaching materials"],
};

interface SearchParams {
    q?: string;
    category?: string;
    subject?: string;
    template?: string;
}

interface EditorProps {
    searchParams: Promise<SearchParams>;
}

const Editor = async ({ searchParams }: EditorProps) => {
    const params = await searchParams;
    const customer = await getCustomer().catch(() => null);
    const userIsPro = !!(customer?.id && customer?.metadata?.isPremium);
    const countryCode = "gb";

    const searchQuery = params.q || "";
    const selectedCategory = params.category || "All";
    const selectedSubject = params.subject || "All";
    const templateId = params.template || null;

    // Fetch premium product IDs first (needed to enrich both list and initial product)
    let premiumProductIds: string[] = [];
    try {
        const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const res = await fetch(`${base}/store/products-with-templates`, {
            headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" },
            cache: "no-store",
        });
        if (res.ok) {
            const data = await res.json();
            premiumProductIds = data.premium_product_ids || [];
        }
    } catch (_) {}
    const setOfPremiumIds = new Set(premiumProductIds);

    // When sharing a template via URL (?template=id), fetch that product so the modal can open
    let initialTemplateProduct: any = null;
    if (templateId) {
        try {
            const region = await getRegion(countryCode);
            if (region?.id) {
                const byId = await getProductsById({ ids: [templateId], regionId: region.id });
                initialTemplateProduct = byId?.[0] ?? null;
                if (initialTemplateProduct && setOfPremiumIds.has(initialTemplateProduct.id)) {
                    const meta = initialTemplateProduct.metadata || {};
                    initialTemplateProduct = {
                        ...initialTemplateProduct,
                        metadata: {
                            ...meta,
                            is_premium: true,
                            is_pro: true,
                            ...(!userIsPro ? { template_data: undefined } : {}),
                        },
                    };
                }
            }
        } catch (_) {
            initialTemplateProduct = null;
        }
    }

    const queryParams: any = {
        order: "-created_at",
        limit: 1000,
    };

    if (searchQuery.trim()) {
        queryParams.q = searchQuery;
    }

    // Link type buttons to product collections: resolve collection_id when a type is selected
    if (selectedCategory !== "All") {
        try {
            const { collections } = await getCollectionsList(0, 200);
            const typeLower = selectedCategory.toLowerCase().replace(/\s+/g, "-");
            const collection = collections?.find(
                (c: any) =>
                    (c.handle && c.handle.toLowerCase() === typeLower) ||
                    (c.title && c.title.toLowerCase() === selectedCategory.toLowerCase())
            );
            if (collection?.id) {
                queryParams.collection_id = [collection.id];
            }
        } catch (_) {
            // If collections fail, we'll filter by title/description/metadata below
        }
    }

    const allProducts = await getProductsList({ queryParams, countryCode }).then(
        ({ response }) => response.products
    ).catch(() => []);

    const filteredProducts = allProducts
        .map((product: any) => {
            const isPremiumFromTemplate = setOfPremiumIds.has(product.id);
            const meta = product.metadata || {};
            if (isPremiumFromTemplate && !meta.is_premium && !meta.is_pro) {
                return { ...product, metadata: { ...meta, is_premium: true, is_pro: true } };
            }
            return product;
        })
        .filter((product: any) => {
        // Show all products (including premium). Pro badge and "Make it Your Own" gating in ProductModal.

        if (selectedCategory === "All") {
            // No type filter
        } else if (!queryParams.collection_id) {
            const matchesType =
                product.title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                product.description?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                product.metadata?.category === selectedCategory ||
                product.metadata?.collection_type === selectedCategory;
            if (!matchesType) return false;
        }

        if (selectedSubject !== "All") {
            const subjectVal = product.metadata?.subject ?? product.metadata?.category_sub ?? product.metadata?.category;
            const subjectStr = typeof subjectVal === "string" ? subjectVal : "";
            if (!subjectStr.toLowerCase().includes(selectedSubject.toLowerCase())) {
                return false;
            }
        }

        return true;
    });

    return (
        <EditorPage 
            customer={customer} 
            products={filteredProducts}
            initialSearchQuery={searchQuery}
            initialCategory={selectedCategory}
            initialSubject={selectedSubject}
            initialTemplateId={templateId || undefined}
            initialTemplateProduct={initialTemplateProduct}
        />
    );
};

export default Editor;
