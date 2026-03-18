import { Metadata } from "next";
import { getCustomer } from "@/lib/data/customer";
import CreatorStorefront from "@/components/creator-storefront/CreatorStorefront";

export const metadata: Metadata = {
    title: "Creator Store | Learnmix",
    description: "Browse resources from this creator",
};

interface PageProps {
    params: {
        creatorSlug: string;
    };
}

const INITIAL_PAGE_SIZE = 12;

const CreatorStorePage = async ({ params }: PageProps) => {
    const { creatorSlug } = params;
    const customer = await getCustomer().catch(() => null);

    // Fetch all products from the creator API endpoint (no server-side pagination)
    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    let creatorProducts: any[] = [];
    let creatorInfo: any = null;
    
    try {
        const response = await fetch(`${BACKEND_URL}/store/creator/${creatorSlug}/products`, {
            headers: {
                'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
            },
            cache: 'no-store',
        });
        
        if (response.ok) {
            const data = await response.json();
            creatorProducts = data.products || [];
            creatorInfo = data.creator;
        }
    } catch (error) {
        console.error('Error fetching creator products:', error);
    }

    // Filter out premium products if user doesn't have Pro subscription
    const filteredProducts = creatorProducts.filter((product: any) => {
        if (product.metadata?.is_premium && (!customer?.id || !customer?.metadata?.isPremium)) {
            return false;
        }
        return true;
    });

    // Use creator info from API or create default (API returns name with username preferred when set in metadata)
    const finalCreatorInfo = creatorInfo ? {
        id: creatorInfo.id,
        name: creatorInfo.name,
        bio: "Educational resource creator",
        avatar: creatorInfo.metadata?.avatar_url,
        store_description: creatorInfo.metadata?.store_description,
    } : {
        id: creatorSlug,
        name: creatorSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        bio: "Educational resource creator",
        avatar: undefined,
        store_description: undefined,
    };

    return (
        <CreatorStorefront
            creator={finalCreatorInfo}
            products={filteredProducts}
            customer={customer}
            initialPageSize={INITIAL_PAGE_SIZE}
        />
    );
};

export default CreatorStorePage;
