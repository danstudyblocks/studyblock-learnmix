"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SquarePen, User, Star, FileImage, X, ArrowUpRight, FileText, Box, Image as ImageIcon, Share2, Sparkles, ShoppingBasket, Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductModal from "./ProductModal";
import UploadResourceModal from "./UploadResourceModal";
import UserMenu from "./UserMenu";

interface Product {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    metadata?: {
        is_pro?: boolean;
        creator_name?: string;
    };
}

interface SvgAsset {
    id: string;
    name: string;
    description?: string;
    svg_url?: string;
    thumbnail?: string;
    category_top?: string;
    category_sub?: string;
    is_premium?: boolean;
    tags?: string[];
}

const SUBJECT_OPTIONS = [
    "All",
    "Math",
    "English",
    "Science",
    "History",
    "Geography",
    "Art",
    "Music",
    "PE",
    "ICT",
    "RE",
    "PSHE",
    "Languages",
    "Other",
];

interface EditorPageProps {
    customer: any;
    products: Product[];
    initialSearchQuery?: string;
    initialCategory?: string;
    initialSubject?: string;
    initialTemplateId?: string;
    initialTemplateProduct?: Product | null;
}

const EditorPage = ({ customer, products, initialSearchQuery = "", initialCategory = "All", initialSubject = "All", initialTemplateId, initialTemplateProduct }: EditorPageProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [showBanner, setShowBanner] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"find" | "create">("find");
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
    const [displayCount, setDisplayCount] = useState(12); // Show 12 products initially
    const [svgAssets, setSvgAssets] = useState<SvgAsset[]>([]);
    const [loadingSvgAssets, setLoadingSvgAssets] = useState(false);
    const [subjectOptions, setSubjectOptions] = useState<string[]>(["All", ...SUBJECT_OPTIONS.slice(1)]);

    // Fetch subject categories from backend
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                if (data.sub_categories && Array.isArray(data.sub_categories)) {
                    setSubjectOptions(["All", ...data.sub_categories.sort()]);
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
                // Keep default subjects if fetch fails
            }
        };
        fetchSubjects();
    }, []);

    // Open template modal when landing with shared URL (?template=id)
    useEffect(() => {
        if (initialTemplateProduct?.id) {
            setSelectedProduct(initialTemplateProduct);
            setIsModalOpen(true);
        }
    }, [initialTemplateId, initialTemplateProduct?.id]);

    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
        const params = new URLSearchParams(searchParams.toString());
        params.set("template", product.id);
        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 300);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("template");
        const qs = params.toString();
        router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    };

    // Fetch SVG assets for Create mode
    const fetchSvgAssets = async (query: string = "", category: string = "All") => {
        setLoadingSvgAssets(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('search', query);
            if (category !== "All") params.append('category_top', category);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/svg-assets?${params.toString()}`);
            const data = await response.json();
            setSvgAssets(data.svg_assets || []);
        } catch (error) {
            console.error('Error fetching SVG assets:', error);
            setSvgAssets([]);
        } finally {
            setLoadingSvgAssets(false);
        }
    };

    const categories = [
        "All",
        "Worksheets",
        "Posters",
        "Postcards",
        "Stickers",
        "Workbooks",
        "Presentation",
    ];

    // Get products to display based on current display count
    const displayedProducts = products.slice(0, displayCount);
    const hasMore = displayCount < products.length;

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 12);
    };

    // Update URL params and trigger server-side search (category = type/collection, subject = category/subject)
    const updateSearchParams = (query: string, category: string, subject: string = selectedSubject) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (query) {
            params.set('q', query);
        } else {
            params.delete('q');
        }
        
        if (category !== "All") {
            params.set('category', category);
        } else {
            params.delete('category');
        }

        if (subject !== "All") {
            params.set('subject', subject);
        } else {
            params.delete('subject');
        }
        
        startTransition(() => {
            router.push(`/?${params.toString()}`);
        });
        
        setDisplayCount(12);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (viewMode === "create") {
            fetchSvgAssets(searchQuery, selectedCategory);
        } else {
            updateSearchParams(searchQuery, selectedCategory, selectedSubject);
        }
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        
        if (viewMode === "create" && (searchQuery || category !== "All")) {
            fetchSvgAssets(searchQuery, category);
        } else {
            updateSearchParams(searchQuery, category, selectedSubject);
        }
    };

    const handleSubjectChange = (subject: string) => {
        setSelectedSubject(subject);
        if (viewMode === "find") {
            updateSearchParams(searchQuery, selectedCategory, subject);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setSelectedSubject("All");
        setDisplayCount(12);
        router.push('/');
    };

    return (
        <div className="flex w-full min-h-screen bg-[#FCFAF8]">
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col w-full">
                    <div className="h-px"></div>
                    
                    {/* Header */}
                    <div className="border-b ml-[2px] bg-[#FCFAF8] border-black/0 p-4">
                        <div className="w-full">
                            <div className="items-center flex justify-between gap-[12px]">
                                <div className="items-center flex grow basis-[0%] gap-[16px]">
                                    <Link 
                                        href="/"
                                        className="items-center flex h-10 hover:opacity-80 transition-opacity cursor-pointer"
                                        aria-label="Go to homepage"
                                    >
                                        <div className="ml-auto mr-auto text-center">
                                            <span 
                                                className="text-2xl font-light tracking-tight"
                                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                            >
                                                learnmix
                                            </span>
                                        </div>
                                    </Link>
                                    
                                    <div className="flex justify-end w-full gap-2 items-center">
                                        <Link 
                                            href="/design-studio"
                                            className="items-center flex font-medium justify-center text-center whitespace-nowrap h-9 bg-white border border-black/20 text-black px-4 py-2 rounded-full hover:bg-gray-50 transition-colors text-[14px] gap-[8px] leading-[20px]"
                                        >
                                            <SquarePen className="w-4 h-4" />
                                            Editor
                                        </Link>
                                        
                                        <UserMenu customer={customer} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col justify-center text-center w-full pt-0 pr-0 pb-8 pl-0">
                        <div className="ml-auto mr-auto text-center w-full max-w-3xl pt-0 pr-4 pb-0 pl-4">
                            
                            {/* Hero Section */}
                            <div className="text-center pt-[0px] pr-[0px] pb-[25px] pl-[0px]">
                                <div className="items-center flex flex-col text-center gap-[24px] pt-2 pr-0 pb-0 pl-0">
                                    <picture className="text-center h-[78px] flex items-center justify-center">
                                        <Image 
                                            alt="hand with learning materials" 
                                            src="/images/imgi2.png"
                                            width={78}
                                            height={78}
                                            className="block max-w-full overflow-clip text-center align-middle w-[78px]"
                                        />
                                    </picture>
                                    
                                    <h1 
                                        className="font-light text-center w-full text-[30px] leading-[45px]"
                                        style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                    >
                                        {viewMode === "find" ? "Find the perfect resource" : "Create the perfect resource"}
                                    </h1>
                                    
                                    {/* Find/Create Toggle Buttons - Commented Out */}
                                    {/* <div className="flex gap-3">
                                        <button 
                                            onClick={() => setViewMode("find")}
                                            className={`items-center border flex font-medium justify-center text-center whitespace-nowrap h-10 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0.1)_0px_1px_3px_0px,_rgba(0,0,0,0.1)_0px_1px_2px_-1px] text-[14px] gap-[8px] leading-[20px] px-6 py-2 rounded-[624.9375rem] transition-colors ${
                                                viewMode === "find" 
                                                    ? "bg-black text-white border-black" 
                                                    : "bg-white text-black border-black hover:bg-gray-50"
                                            }`}
                                        >
                                            Find
                                        </button>
                                        <button 
                                            onClick={() => setViewMode("create")}
                                            className={`items-center border flex font-medium justify-center text-center whitespace-nowrap h-10 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0.1)_0px_1px_3px_0px,_rgba(0,0,0,0.1)_0px_1px_2px_-1px] text-[14px] gap-[8px] leading-[20px] px-6 py-2 rounded-[624.9375rem] transition-colors ${
                                                viewMode === "create" 
                                                    ? "bg-black text-white border-black" 
                                                    : "bg-white text-black border-black hover:bg-gray-50"
                                            }`}
                                        >
                                            Create
                                        </button>
                                    </div> */}
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="sticky text-center top-[72px] pt-6 pr-0 pb-0 pl-0 z-[1]">
                                <form className="text-center" onSubmit={handleSearch}>
                                    <div className="border flex flex-col ml-auto mr-auto overflow-x-hidden overflow-y-auto relative text-center w-full bg-white border-black/20 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0.024)_0px_5px_15px_0px] max-w-lg z-[10] rounded-3xl">
                                        <div className="items-center flex text-center gap-[4px] pt-2 pr-2 pb-2 pl-5">
                                            <div className="items-center flex flex-col grow relative text-center top-px w-full gap-[4px]">
                                                <input 
                                                    type="text"
                                                    placeholder={
                                                        viewMode === "find" 
                                                            ? selectedCategory !== "All"
                                                                ? `I'm looking for ${selectedCategory.toLowerCase()}...`
                                                                : "I'm looking for..."
                                                            : "I want to create..."
                                                    }
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleSearch(e as any);
                                                        }
                                                    }}
                                                    className="block outline-solid overflow-hidden whitespace-nowrap w-full h-6 bg-black/0 text-black leading-[24px] min-h-6 outline-black/0 outline-offset-[2px] outline-[2px]"
                                                />
                                            </div>
                                            <div className="items-center flex h-full text-center gap-[6px]">
                                                {searchQuery && (
                                                    <button 
                                                        onClick={() => {
                                                            setSearchQuery("");
                                                            if (selectedCategory === "All") {
                                                                router.push('/');
                                                            } else {
                                                                updateSearchParams("", selectedCategory);
                                                            }
                                                        }}
                                                        className="items-center flex justify-center w-7 h-7 hover:bg-gray-100 rounded-full transition-colors"
                                                        type="button"
                                                        title="Clear search"
                                                    >
                                                        <X className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                )}
                                                <button 
                                                    className="items-center flex font-medium justify-center text-center whitespace-nowrap w-8 h-8 bg-black shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0.1)_0px_1px_3px_0px,_rgba(0,0,0,0.1)_0px_1px_2px_-1px] text-[rgb(42,37,34)] text-[14px] gap-[8px] leading-[20px] pt-2 pr-0 pb-2 pl-0 rounded-[624.9375rem]"
                                                    type="submit"
                                                    disabled={isPending}
                                                >
                                                    <div className="text-center">
                                                        {isPending ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="11" cy="11" r="8"></circle>
                                                                <path d="m21 21-4.35-4.35"></path>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Type (collection) pills: Posters, Postcards, etc. */}
                            <div className="flex justify-center gap-2 flex-wrap pt-4 pr-0 pb-3 pl-0">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryChange(category)}
                                        disabled={isPending}
                                        className={`px-3 py-[5px] text-[12px] border rounded-full transition-all ${
                                            selectedCategory === category
                                                ? "bg-black text-white border-black shadow-md"
                                                : "bg-white text-black border-black/20 hover:bg-gray-50 hover:border-black/30 hover:shadow-sm"
                                        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Subject (category) dropdown */}
                            {viewMode === "find" && (
                                <div className="flex justify-center items-center gap-2 pb-6">
                                    <label htmlFor="subject-filter" className="text-sm text-gray-600 whitespace-nowrap">
                                        Subject:
                                    </label>
                                    <select
                                        id="subject-filter"
                                        value={selectedSubject}
                                        onChange={(e) => handleSubjectChange(e.target.value)}
                                        disabled={isPending}
                                        className="px-3 py-2 text-[12px] border border-black/20 rounded-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 disabled:opacity-50 cursor-pointer"
                                    >
                                        {subjectOptions.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Conditional Content Based on View Mode */}
                            {viewMode === "find" ? (
                                <>
                                    {/* Products Grid */}
                                    <div className="flex flex-col text-left gap-[32px]">
                                        {isPending ? (
                                            <div className="text-center py-12">
                                                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-gray-500">Loading resources...</p>
                                            </div>
                                        ) : displayedProducts.length > 0 ? (
                                            <>
                                                <div className="grid text-left gap-[16px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                                    {displayedProducts.map((product, index) => (
                                        <div key={product.id} style={{ opacity: 1, transform: "none" }}>
                                            <div className="border text-left bg-white border-black/20 rounded-2xl hover:shadow-lg transition-shadow h-full flex flex-col">
                                                <div className="text-left">
                                                    <div className="text-left">
                                                        <div 
                                                            className="text-left w-full p-2 rounded-[0.625rem] relative cursor-pointer"
                                                            onClick={() => handleViewProduct(product)}
                                                        >
                                                            {(product.metadata?.is_pro || product.metadata?.is_premium) && (
                                                                <span className="absolute top-3 right-3 bg-white text-black text-[10px] font-semibold px-2 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                                                                    <Star className="w-3 h-3 fill-black" />
                                                                    PRO
                                                                </span>
                                                            )}
                                                            {product.thumbnail && (
                                                                <img
                                                                    alt={product.title}
                                                                    src={product.thumbnail}
                                                                    className="block size-full max-w-full object-cover overflow-clip text-left align-middle aspect-[3/4] rounded-[0.625rem] hover:opacity-90 transition-opacity"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-left">
                                                            <p 
                                                                className="border-b border-t inline-block text-left w-full border-black/0 leading-[24px] p-4 min-h-[72px] flex items-center text-[16px] font-normal"
                                                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                                            >
                                                                {product.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-left pt-0 pr-[10px] pb-0 pl-[10px]">
                                                        <div role="none" className="text-left w-full h-[0.5px] bg-[rgb(221,215,213)]"></div>
                                                    </div>
                                                    <div className="text-left p-4">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <button 
                                                                onClick={() => handleViewProduct(product)}
                                                                className="flex items-center justify-center flex-1 border border-black/20 bg-transparent text-black px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors text-[12px] leading-[16px]"
                                                            >
                                                                View
                                                            </button>
                                                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full border border-black/10">
                                                                <FileImage className="w-4 h-4 text-black" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* Load More Button */}
                                                {hasMore && (
                                                    <div className="text-center mt-8">
                                                        <button 
                                                            onClick={handleLoadMore}
                                                            className="items-center self-center border inline-flex font-medium justify-center text-center whitespace-nowrap h-10 bg-white border-black/20 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0.05)_0px_1px_2px_0px] text-[14px] gap-[8px] leading-[20px] px-6 py-2 rounded-full hover:bg-gray-50 transition-colors"
                                                        >
                                                            Load More ({products.length - displayCount} remaining)
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="text-gray-400 mb-4">
                                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-lg">No resources found</p>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    {searchQuery 
                                                        ? `Try adjusting your search or filters` 
                                                        : `No ${selectedCategory.toLowerCase()} available`}
                                                </p>
                                            </div>
                                        )}
                            </div>

                            {/* More Resources Button - Removed since we have Load More */}
                                </>
                            ) : (
                                <>
                                    {/* Create View Content */}
                                    {/* Show SVG assets (blocks) if search or category filter is active */}
                                    {(searchQuery || selectedCategory !== "All") ? (
                                        <div className="flex flex-col text-left gap-[32px]">
                                            {loadingSvgAssets ? (
                                                <div className="text-center py-12">
                                                    <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
                                                    <p className="text-gray-500">Loading blocks...</p>
                                                </div>
                                            ) : svgAssets.length > 0 ? (
                                                <>
                                                    <div className="grid text-left gap-[16px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                                                        {svgAssets.map((asset) => (
                                                            <div key={asset.id} style={{ opacity: 1, transform: "none" }}>
                                                                <div className="border text-left bg-white border-black/20 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
                                                                    <div className="text-left">
                                                                        <div className="text-left">
                                                                            <div className="text-left w-full p-4 rounded-[0.625rem] relative aspect-square flex items-center justify-center bg-gray-50">
                                                                                {asset.is_premium && (
                                                                                    <span className="absolute top-2 right-2 bg-white text-black text-[10px] font-semibold px-2 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                                                                                        <Star className="w-3 h-3 fill-black" />
                                                                                        PRO
                                                                                    </span>
                                                                                )}
                                                                                {asset.thumbnail ? (
                                                                                    <img
                                                                                        alt={asset.name}
                                                                                        src={asset.thumbnail}
                                                                                        className="block max-w-full max-h-full object-contain"
                                                                                    />
                                                                                ) : asset.svg_url ? (
                                                                                    <img
                                                                                        alt={asset.name}
                                                                                        src={asset.svg_url}
                                                                                        className="block max-w-full max-h-full object-contain"
                                                                                    />
                                                                                ) : (
                                                                                    <Box className="w-12 h-12 text-gray-400" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-left p-3">
                                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                                {asset.name}
                                                                            </p>
                                                                            {asset.category_top && (
                                                                                <p className="text-xs text-gray-500 mt-1">
                                                                                    {asset.category_top}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-left pt-0 pr-[10px] pb-0 pl-[10px]">
                                                                            <div role="none" className="text-left w-full h-[0.5px] bg-[rgb(221,215,213)]"></div>
                                                                        </div>
                                                                        <div className="text-left p-3">
                                                                            <Link
                                                                                href={`/design-studio?asset=${asset.id}`}
                                                                                className="flex items-center justify-center w-full border border-black/20 bg-transparent text-black px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors text-[12px] leading-[16px]"
                                                                            >
                                                                                Use in Editor
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="text-gray-400 mb-4">
                                                        <Box className="w-16 h-16 mx-auto" />
                                                    </div>
                                                    <p className="text-gray-500 text-lg">No blocks found</p>
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        {searchQuery 
                                                            ? `Try adjusting your search or filters` 
                                                            : `No ${selectedCategory.toLowerCase()} blocks available`}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Show static cards when no search/filter */
                                    <div className="flex flex-col text-left gap-[32px]">
                                        <div className="grid text-left gap-[24px] grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto mt-8">
                                            {/* Templates Card */}
                                            <div className="bg-white border border-black/10 rounded-2xl p-8 text-center">
                                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <FileText className="w-8 h-8 text-blue-600" />
                                                </div>
                                                <h3 
                                                    className="text-xl font-light mb-4"
                                                    style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                                >
                                                    Templates
                                                </h3>
                                                <p className="text-gray-600 text-[14px] leading-relaxed">
                                                    Select from thousands of educational resource templates and layouts so you never have to start from scratch again
                                                </p>
                                            </div>

                                            {/* Blocks Card */}
                                            <div className="bg-white border border-black/10 rounded-2xl p-8 text-center">
                                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <Box className="w-8 h-8 text-orange-600" />
                                                </div>
                                                <h3 
                                                    className="text-xl font-light mb-4"
                                                    style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                                >
                                                    Blocks
                                                </h3>
                                                <p className="text-gray-600 text-[14px] leading-relaxed">
                                                    Add premade elements such as grids, content boxes, and pages created by teachers for teachers
                                                </p>
                                            </div>

                                            {/* Icons Card */}
                                            <div className="bg-white border border-black/10 rounded-2xl p-8 text-center">
                                                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <ImageIcon className="w-8 h-8 text-purple-600" />
                                                </div>
                                                <h3 
                                                    className="text-xl font-light mb-4"
                                                    style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                                >
                                                    Icons
                                                </h3>
                                                <p className="text-gray-600 text-[14px] leading-relaxed">
                                                    Choose from millions of icons and educational design elements to help you create high-quality learning resources in a flash
                                                </p>
                                            </div>

                                            {/* Share Card - Full Width */}
                                            <div className="bg-white border border-black/10 rounded-2xl p-8 md:col-span-3">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Share2 className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 
                                                            className="text-xl font-light mb-2"
                                                            style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                                        >
                                                            Share
                                                        </h3>
                                                        <p className="text-gray-600 text-[14px] leading-relaxed">
                                                            Upload your resource to LearnMix to support your colleagues from across the world
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Coming Soon Section */}
                                        <div className="max-w-5xl mx-auto mt-12">
                                            <div className="text-center mb-8">
                                                <h2 
                                                    className="text-2xl font-light text-gray-800"
                                                    style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                                >
                                                    Coming Soon
                                                </h2>
                                            </div>
                                            <div className="grid text-left gap-[24px] grid-cols-1 md:grid-cols-3">
                                                {/* AI Generation Card */}
                                                <div className="bg-white border border-black/10 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                                                    <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <Sparkles className="w-8 h-8 text-yellow-600" />
                                                    </div>
                                                    <h3 
                                                        className="text-xl font-light mb-4"
                                                        style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                                    >
                                                        AI Generation
                                                    </h3>
                                                    <p className="text-gray-600 text-[14px] leading-relaxed">
                                                        Create resources with a prompt
                                                    </p>
                                                </div>

                                                {/* Sell Your Resources Card */}
                                                <div className="bg-white border border-black/10 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <ShoppingBasket className="w-8 h-8 text-emerald-600" />
                                                    </div>
                                                    <h3 
                                                        className="text-xl font-light mb-4"
                                                        style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                                    >
                                                        Sell Your Resources
                                                    </h3>
                                                    <p className="text-gray-600 text-[14px] leading-relaxed">
                                                        Monetise your resources and expertise
                                                    </p>
                                                </div>

                                                {/* Print on Demand Card */}
                                                <div className="bg-white border border-black/10 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                                                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <Printer className="w-8 h-8 text-rose-600" />
                                                    </div>
                                                    <h3 
                                                        className="text-xl font-light mb-4"
                                                        style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                                    >
                                                        Print on Demand
                                                    </h3>
                                                    <p className="text-gray-600 text-[14px] leading-relaxed">
                                                        Get physical copies delivered to your classroom
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Bottom Banner - Full */}
                        {showBanner && (
                            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[80%] max-w-[calc(48rem*0.8)] z-50">
                                <div className="relative w-full">
                                    <button 
                                        onClick={() => setShowBanner(false)}
                                        className="absolute -top-3 -left-3 w-8 h-8 bg-white border border-black/10 hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors z-10"
                                        aria-label="Close"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <div className="bg-white border border-black/10 rounded-3xl relative py-4 px-6">
                                        <div className="flex items-center justify-between gap-4">
                                            <button 
                                                onClick={() => setIsUploadModalOpen(true)}
                                                className="flex items-start gap-3 text-left hover:opacity-90 transition-opacity flex-1"
                                            >
                                                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                                                    <Image 
                                                        src="/images/imgi1.png"
                                                        alt="Peace hand"
                                                        width={56}
                                                        height={56}
                                                        className="w-14 h-14 object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-[14px] text-gray-600 text-left font-bold">
                                                        Introductory offer
                                                    </div>
                                                    <div className="text-[15px] text-gray-900 text-left">
                                                        Upload a resource and have it professionally designed for free
                                                    </div>
                                                </div>
                                            </button>
                                            <button 
                                                onClick={() => setIsUploadModalOpen(true)}
                                                className="w-12 h-12 bg-black hover:bg-black/90 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                                            >
                                                <ArrowUpRight className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bottom Banner - Minimized Circle */}
                        {!showBanner && (
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="fixed bottom-8 right-8 w-16 h-16 bg-white border border-black/10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 hover:scale-105"
                                aria-label="Upload resource"
                            >
                                <Image 
                                    src="/images/imgi1.png"
                                    alt="Peace hand"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-contain"
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            <ProductModal 
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                customer={customer}
            />

            {/* Upload Resource Modal */}
            <UploadResourceModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                customer={customer}
            />
        </div>
    );
};

export default EditorPage;
