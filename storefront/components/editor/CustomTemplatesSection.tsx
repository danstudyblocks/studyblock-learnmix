import { fetchs3json, fetchTemplates } from "@/lib/data/vendor"; // Adjust import path
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating unique IDs
import PremiumTemplateModal from "@/components/editor-page/PremiumTemplateModal";

const CustomTemplatesSection = observer(({ store, customer }: { store: any, customer: any }) => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const fetchTemplatesData = async () => {
        setLoading(true);
        const result = await fetchTemplates();
        if (result.success) {
            setTemplates(result.templates || []);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTemplatesData();
    }, []);

    const handleTemplateClick = async (template: any) => {
        // Check if template is premium
        if (template.is_premium && !customer?.metadata?.isPremium) {
            setShowPremiumModal(true);
            return;
        }

        setLoading(true);
        try {
            let templateData = template.template_data;

            // Handle cases where template_data needs fetching or parsing
            if (!templateData || typeof templateData === "string") {
                // Handle URL (e.g., S3 JSON)
                if (typeof templateData === "string" && templateData.startsWith("http")) {
                    // Fetch the JSON from the URL
                    const response = await fetchs3json(templateData);
                    if (!response.success) {
                        console.error("Failed to fetch template data from URL:", templateData);
                        return;
                    }
                    const jsonResponse = response.data;
                    templateData = await jsonResponse;
                }
                // Handle JSON string
                else if (typeof templateData === "string" && !templateData.startsWith("http")) {
                    templateData = JSON.parse(templateData);
                }
            }

            // Clean and validate templateData to match Store model
            const cleanedTemplateData = {
                width: templateData.width || 1080,
                height: templateData.height || 1080,
                unit: templateData.unit || "px",
                dpi: templateData.dpi || 72,
                pages: (templateData.pages || []).map((page: any, index: number) => ({
                    ...page,
                    id: page.id || `page_${uuidv4()}`, // Assign unique ID if missing
                    children: page.children || [],
                    background: page.background || "white",
                    width: page.width || "auto",
                    height: page.height || "auto",
                    bleed: page.bleed || 0,
                    duration: page.duration || 5000,
                })),
                // Include nodes if present
                ...(templateData.nodes ? { nodes: templateData.nodes } : {}),
            };

            // Load into store
            if (cleanedTemplateData.pages?.length || cleanedTemplateData.nodes) {
                store.loadJSON(cleanedTemplateData);
            } else {
                store.loadJSON({
                    width: 1080,
                    height: 1080,
                    pages: [{
                        id: `page_${uuidv4()}`, // Ensure default page has an ID
                        children: [],
                        background: "white",
                        width: "auto",
                        height: "auto",
                        bleed: 0,
                        duration: 5000,
                    }],
                    unit: "px",
                    dpi: 72,
                });
            }
        } catch (error) {
            console.error("Error loading template:", error);
            //@ts-ignore
            setError(`Failed to load template: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced filter function to include tags and subcategory
    const filteredTemplates = templates.filter((template) => {
        const searchLower = searchTerm.toLowerCase();

        // Check name
        const matchesName = template.name.toLowerCase().includes(searchLower);

        // Check tags
        const matchesTags = template.tags && Array.isArray(template.tags)
            ? template.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
            : false;

        // Check category
        const matchesCategory = !selectedCategory || template.category_top === selectedCategory;
        
        // Check subcategory
        const matchesSubCategory = !selectedSubCategory || template.category_sub === selectedSubCategory;

        return (matchesName || matchesTags) && matchesCategory && matchesSubCategory;
    });

    // Group filtered templates by category_top
    const categories = filteredTemplates.reduce(
        (acc: { [key: string]: any[] }, template) => {
            const category = template.category_top;
            acc[category] = acc[category] || [];
            acc[category].push(template);
            return acc;
        },
        {}
    );

    // Get unique subcategories (filtered by selected category if applicable)
    const availableSubCategories = Array.from(
        new Set(
            templates
                .filter(template => !selectedCategory || template.category_top === selectedCategory)
                .map(template => template.category_sub)
                .filter(Boolean)
        )
    ).sort();

    // Template Card Component
    const TemplateCard = ({ template, size = "small" }: { template: any; size?: "small" | "large" }) => {
        return (
            <div
                className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:shadow-md relative group"
                onClick={() => handleTemplateClick(template)}
            >
                {/* Premium Badge */}
                {template.is_premium && (
                    <div className="absolute top-2 right-2 z-10">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            PRO
                        </div>
                    </div>
                )}

                <div className="relative overflow-hidden rounded bg-gray-50 flex items-center justify-center">
                    <img
                        src={template.thumbnail?.replace(/"/g, '') || "https://www.w3schools.com/css/paris.jpg"}
                        alt={template.name}
                        className="w-full h-auto object-contain mb-2 transition-transform duration-200 group-hover:scale-105"
                    />
                    {template.is_premium && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                </div>

                <div className={size === "large" ? "space-y-1" : ""}>
                    <p className={`font-medium ${size === "large" ? "text-base" : "text-sm"} text-center truncate`}>
                        {template.name}
                    </p>
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="p-4">
            <div className="flex flex-col justify-between mb-4">
                <h2 className="text-2xl font-bold mb-2">Templates</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or tags..."
                        className="w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Category and Subcategory Dropdowns */}
            <div className="mb-6 flex flex-col md:flex-row gap-3">
                <select
                    value={selectedCategory || ""}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value || null);
                        setSelectedSubCategory(null); // Reset subcategory when category changes
                    }}
                    className="w-full md:w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                >
                    <option value="">All Categories</option>
                    {Object.keys(categories).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                
                <select
                    value={selectedSubCategory || ""}
                    onChange={(e) => setSelectedSubCategory(e.target.value || null)}
                    className="w-full md:w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                    disabled={availableSubCategories.length === 0}
                >
                    <option value="">All Subcategories</option>
                    {availableSubCategories.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                            {subCategory}
                        </option>
                    ))}
                </select>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {Object.entries(categories).map(([category, items]) =>
                    items.map((template) => (
                        <TemplateCard key={template.id} template={template} />
                    ))
                )}
            </div>

            {/* No results message */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No templates found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Premium Modal - same component as ProductModal; checkout flow in design-studio */}
            <PremiumTemplateModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                customer={customer}
                primaryAction="checkout"
            />
        </div>
    );
});

export default CustomTemplatesSection;