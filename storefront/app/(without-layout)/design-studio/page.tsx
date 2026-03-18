import { Metadata } from "next";
import SimpleStudio from "@/components/designEditor/simple-studio";
import { getCustomer } from "@/lib/data/customer";

// Polotno and design editor use document/window at module load; skip static prerender.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Learnmix Studio - Online Design Editor",
    description: "Create graphical designs for social media, YouTube previews, Facebook covers, and more.",
    keywords: ["design editor", "online design", "social media graphics", "YouTube thumbnails", "Facebook covers", "Learnmix Studio"],
};

const DesignStudioV2Page = async () => {
    const customer = await getCustomer().catch(() => null);

    return (
        <>
            <SimpleStudio customer={customer} />
        </>
    );
};

export default DesignStudioV2Page;
