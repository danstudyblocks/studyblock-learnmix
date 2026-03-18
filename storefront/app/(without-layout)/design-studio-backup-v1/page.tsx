import { Metadata } from "next";
import DesignStudio from "@/components/designEditor/studio";
import { getCustomer } from "@/lib/data/customer";

export const metadata: Metadata = {
    title: "Learnmix Studio - Online Design Editor",
    description: "Create graphical designs for social media, YouTube previews, Facebook covers, and more.",
    keywords: ["design editor", "online design", "social media graphics", "YouTube thumbnails", "Facebook covers", "Learnmix Studio"],
};

const DesignStudioPage = async () => {
    const customer = await getCustomer().catch(() => null);

    return (
        <>
            <DesignStudio customer={customer} />
        </>
    );
};

export default DesignStudioPage;
