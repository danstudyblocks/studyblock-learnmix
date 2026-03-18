import { Metadata } from "next";
import { getCustomer } from "@/lib/data/customer";
import EditorPage from "@/components/editor-page/EditorPage";

export const metadata: Metadata = {
    title: "Editor - Find the perfect resource | Learnmix",
    description: "Find and create the perfect educational resources with Learnmix editor.",
    keywords: ["editor", "educational resources", "worksheets", "posters", "teaching materials"],
};

interface SearchParams {
    q?: string;
    category?: string;
    template?: string;
}

interface HomeProps {
    searchParams: Promise<SearchParams>;
}

const Home = async ({ searchParams }: HomeProps) => {
    const params = await searchParams;
    const customer = await getCustomer().catch(() => null);

    const searchQuery = (params.q || "").trim().toLowerCase();
    const selectedCategory = params.category || "All";
    const templateId = params.template || null;

    // For share links: ?template=id should open the template modal
    let initialTemplateProduct: any = null;
    if (templateId) {
        try {
            const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
            const res = await fetch(`${base}/store/templates/${templateId}`, {
                headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" },
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
                const t = data.template;
                if (t) {
                    initialTemplateProduct = {
                        id: t.id,
                        title: t.name,
                        thumbnail: t.thumbnail,
                        description: "",
                        metadata: {
                            is_premium: !!t.is_premium,
                            is_pro: !!t.is_premium,
                            template_data: t.template_data,
                            creator_id: t.creator_id,
                            isTemplate: true,
                        },
                    };
                }
            }
        } catch (_) {}
    }

    // Fetch templates from store API (templates have is_premium, template_data, etc.)
    let templates: any[] = [];
    try {
        const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const res = await fetch(`${base}/store/templates`, {
            headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" },
            cache: "no-store",
        });
        if (res.ok) {
            const data = await res.json();
            templates = data.templates || [];
        }
    } catch (_) {}

    const userIsPro = !!(customer?.id && customer?.metadata?.isPremium);

    // Map templates to product-like shape for EditorPage + ProductModal (id, title, thumbnail, metadata.is_premium, metadata.template_data, metadata.isTemplate, metadata.creator_id)
    // For premium templates when user is not Pro: do NOT send template_data so they cannot load it in the editor
    let items = templates.map((t: any) => {
        const isPremium = !!t.is_premium;
        const includeTemplateData = !isPremium || userIsPro;
        return {
            id: t.id,
            title: t.name,
            thumbnail: t.thumbnail,
            description: "",
            metadata: {
                is_premium: isPremium,
                is_pro: isPremium,
                ...(includeTemplateData ? { template_data: t.template_data } : {}),
                creator_id: t.creator_id,
                isTemplate: true,
                category_top: t.category_top,
                category_sub: t.category_sub,
            },
        };
    });

    // Show all templates (including premium). Pro badge and "Make it Your Own" gating are handled in EditorPage + ProductModal.

    // Filter by category (All = show all; otherwise match category_top or category_sub)
    if (selectedCategory !== "All") {
        const cat = selectedCategory.toLowerCase();
        items = items.filter((item: any) => {
            const top = (item.metadata?.category_top || "").toLowerCase();
            const sub = (item.metadata?.category_sub || "").toLowerCase();
            return top.includes(cat) || sub.includes(cat) || (item.title || "").toLowerCase().includes(cat);
        });
    }

    // Filter by search query
    if (searchQuery) {
        items = items.filter((item: any) => {
            const title = (item.title || "").toLowerCase();
            const top = (item.metadata?.category_top || "").toLowerCase();
            const sub = (item.metadata?.category_sub || "").toLowerCase();
            const tags = (item.metadata?.tags || []).join(" ").toLowerCase();
            return title.includes(searchQuery) || top.includes(searchQuery) || sub.includes(searchQuery) || tags.includes(searchQuery);
        });
    }

    return (
        <EditorPage
            customer={customer}
            products={items}
            initialSearchQuery={params.q || ""}
            initialCategory={selectedCategory}
            initialTemplateId={templateId || undefined}
            initialTemplateProduct={initialTemplateProduct}
        />
    );
};

export default Home;
