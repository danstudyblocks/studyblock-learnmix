"use client";

import { useState, useEffect } from "react";
import { X, Download, SquarePen, Share2, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchs3json } from "@/lib/data/vendor";
import PremiumTemplateModal from "./PremiumTemplateModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

interface Product {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    metadata?: {
        is_pro?: boolean;
        is_premium?: boolean;
        isTemplate?: boolean;
        creator_name?: string;
        creator_id?: string;
        template_data?: any;
        design_json?: any;
    };
}

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    customer?: any;
}

const ProductModal = ({ product, isOpen, onClose, customer }: ProductModalProps) => {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportDetails, setReportDetails] = useState("");
    const [creatorName, setCreatorName] = useState<string>("");
    const [creatorId, setCreatorId] = useState<string>("");
    const [creatorAvatar, setCreatorAvatar] = useState<string>("");
    const [shareCopied, setShareCopied] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [isPremiumFromLinkedTemplate, setIsPremiumFromLinkedTemplate] = useState<boolean | null>(null);
    const [templateIsPremiumFromApi, setTemplateIsPremiumFromApi] = useState<boolean | null>(null);

    // For templates (from home): fetch single template by id to get definitive is_premium for badge and gating
    useEffect(() => {
        if (!product?.id || !product.metadata?.isTemplate) {
            setTemplateIsPremiumFromApi(null);
            return;
        }
        setTemplateIsPremiumFromApi(null);
        fetch(`/api/templates/${product.id}`)
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                const isPremium = !!data?.template?.is_premium;
                setTemplateIsPremiumFromApi(isPremium);
            })
            .catch(() => setTemplateIsPremiumFromApi(null));
    }, [product?.id, product?.metadata?.isTemplate]);

    // For products (not template cards from home): fetch linked digital products to know if template is premium
    useEffect(() => {
        if (!product?.id || product.metadata?.isTemplate) {
            setIsPremiumFromLinkedTemplate(null);
            return;
        }
        if (product.metadata?.is_premium || product.metadata?.is_pro) {
            setIsPremiumFromLinkedTemplate(true);
            return;
        }
        setIsPremiumFromLinkedTemplate(null);
        fetch(`/api/products/${product.id}/digital-products`)
            .then((res) => res.ok ? res.json() : { digital_products: [] })
            .then((data) => {
                const list = data.digital_products || [];
                const hasPremium = list.some((dp: any) => dp?.is_premium === true);
                setIsPremiumFromLinkedTemplate(hasPremium);
            })
            .catch(() => setIsPremiumFromLinkedTemplate(false));
    }, [product?.id, product?.metadata?.isTemplate, product?.metadata?.is_premium, product?.metadata?.is_pro]);
    const [isDownloading, setIsDownloading] = useState(false);

    // Fetch real creator name, ID, and avatar from backend
    useEffect(() => {
        if (!product?.id) return;
        setCreatorName(""); // reset on product change
        setCreatorId("");
        setCreatorAvatar("");

        // If creator info is already in metadata, use it
        if (product.metadata?.creator_name) {
            setCreatorName(product.metadata.creator_name);
        }
        if (product.metadata?.creator_id) {
            setCreatorId(product.metadata.creator_id);
        }

        // For templates use template creator endpoint; for products use product creator
        const isTemplate = product.metadata?.isTemplate;
        const url = isTemplate
            ? `/api/templates/${product.id}/creator`
            : `${BACKEND_URL}/store/products/${product.id}/creator`;

        const headers: HeadersInit = isTemplate ? {} : {
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
        };

        fetch(url, { headers })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (data?.customer) {
                    const c = data.customer;
                    const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
                    setCreatorName(fullName || c.email || "Learnmix");
                    setCreatorId(c.id || "");
                    setCreatorAvatar(c.metadata?.avatar_url || "");
                } else {
                    setCreatorName("Learnmix");
                }
            })
            .catch((error) => {
                console.error('[ProductModal] Error fetching creator:', error);
                setCreatorName("Learnmix");
            });
    }, [product?.id, product?.metadata?.creator_name, product?.metadata?.creator_id, product?.metadata?.isTemplate]);

    // Check if product is already favorited when modal opens or product changes
    useEffect(() => {
        if (product && customer?.id) {
            const storedFavorites = localStorage.getItem(`favorites_${customer.id}`);
            if (storedFavorites) {
                try {
                    const favorites = JSON.parse(storedFavorites);
                    setIsFavorite(favorites.includes(product.id));
                } catch (error) {
                    console.error("Error loading favorites:", error);
                }
            } else {
                setIsFavorite(false);
            }
        }
    }, [product, customer?.id]);

    if (!isOpen || !product) return null;

    const isPremium = !!(
        product.metadata?.is_premium ||
        product.metadata?.is_pro ||
        isPremiumFromLinkedTemplate === true ||
        templateIsPremiumFromApi === true
    );

    const handleAddToFavorites = async () => {
        if (!customer?.id) {
            alert("Please sign in to add favorites");
            return;
        }

        try {
            const storageKey = `favorites_${customer.id}`;
            const storedFavorites = localStorage.getItem(storageKey);
            let favorites: string[] = [];

            if (storedFavorites) {
                favorites = JSON.parse(storedFavorites);
            }

            if (isFavorite) {
                // Remove from favorites
                favorites = favorites.filter(id => id !== product.id);
                setIsFavorite(false);
                alert("Removed from favorites");
            } else {
                // Add to favorites
                favorites.push(product.id);
                setIsFavorite(true);
                alert("Added to favorites");
            }

            // Save to localStorage
            localStorage.setItem(storageKey, JSON.stringify(favorites));
        } catch (error) {
            console.error("Error updating favorites:", error);
            alert("Failed to update favorites");
        }
    };

    const handleReportIssue = () => {
        setShowReportModal(true);
    };

    const handleSubmitReport = async () => {
        if (!customer?.id) {
            alert("Please sign in to report issues");
            return;
        }

        if (!reportReason || !reportDetails) {
            alert("Please fill in all fields");
            return;
        }

        try {
            // TODO: Implement API call to submit report
            console.log("Report submitted:", { productId: product.id, reason: reportReason, details: reportDetails });
            alert("Report submitted successfully");
            setShowReportModal(false);
            setReportReason("");
            setReportDetails("");
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Failed to submit report");
        }
    };

    const handleShare = async () => {
        if (!product?.id) return;
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        if (!origin) return;
        const isTemplate = product.metadata?.isTemplate;
        const shareUrl = isTemplate
            ? `${origin}/?template=${encodeURIComponent(product.id)}`
            : `${origin}/?template=${encodeURIComponent(product.id)}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
            alert("Could not copy link");
        }
    };

    const handleCreatorClick = () => {
        // Use creator ID if available, otherwise use name slug
        if (creatorId) {
            router.push(`/store/creator/${creatorId}`);
        } else {
            const nameToUse = creatorName || "Learnmix";
            const creatorSlug = nameToUse.toLowerCase().replace(/\s+/g, '-');
            router.push(`/store/creator/${creatorSlug}`);
        }
    };

    const handleDownload = async () => {
        const userIsPro = customer?.metadata?.isPremium;
        if (isPremium && !userIsPro) {
            alert("This is a Pro template. Please upgrade to Pro to download the PDF.");
            return;
        }

        setIsDownloading(true);

        try {
            // First, check if product has a PDF attachment (uploaded from admin)
            const pdfCheckRes = await fetch(`${BACKEND_URL}/store/products/${product.id}/pdf-attachment`, {
                headers: {
                    'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
                }
            });

            if (pdfCheckRes.ok) {
                const pdfData = await pdfCheckRes.json();
                if (pdfData.has_pdf && pdfData.url) {
                    // Download the PDF attachment
                    const link = document.createElement("a");
                    link.href = pdfData.url;
                    link.download = pdfData.filename || `${product.title}.pdf`;
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setIsDownloading(false);
                    return;
                }
            }

            // If no PDF attachment, try other sources (existing logic)
            const product_data = product as any;
            let downloadUrl = null;

            // Check medias array
            if (product_data.medias && product_data.medias.length > 0) {
                const mainMedia = product_data.medias.find((m: any) => m.type === "main");
                if (mainMedia && mainMedia.fileId) {
                    downloadUrl = `${BACKEND_URL}/static/${mainMedia.fileId}`;
                }
            }

            // Check metadata for file URL
            if (!downloadUrl && product_data.metadata?.file_url) {
                downloadUrl = product_data.metadata.file_url;
            }

            // Check metadata for download_url
            if (!downloadUrl && product_data.metadata?.download_url) {
                downloadUrl = product_data.metadata.download_url;
            }

            if (downloadUrl) {
                const backendOrigin = (BACKEND_URL || "").replace(/\/$/, "");
                const isBackendUrl =
                    backendOrigin &&
                    (downloadUrl.startsWith(backendOrigin + "/") || downloadUrl === backendOrigin);

                // Use same-origin proxy for backend URLs so browser always downloads (no new tab)
                if (isBackendUrl) {
                    const proxyUrl = `/api/download?url=${encodeURIComponent(downloadUrl)}&filename=${encodeURIComponent(`${product.title}.pdf`)}`;
                    const link = document.createElement("a");
                    link.href = proxyUrl;
                    link.download = `${product.title}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setIsDownloading(false);
                    return;
                }

                // For other origins (e.g. S3): use same-origin API to fetch, convert image→PDF if needed, then download
                const apiUrl = `/api/download-as-pdf?url=${encodeURIComponent(downloadUrl)}&filename=${encodeURIComponent(`${product.title}.pdf`)}`;
                const res = await fetch(apiUrl);
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || "Download failed");
                }
                const blob = await res.blob();
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = `${product.title}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                setIsDownloading(false);
                return;
            }

            // If still no download URL, try to generate PDF from template data
            if (product_data.metadata?.template_data) {
                setIsDownloading(false);
                alert("This product can be opened in the editor. Click 'Make it Your Own' to customize and download.");
                return;
            }

            // Fallback: If no media, show message
            setIsDownloading(false);
            alert("PDF not available for this product.");
        } catch (error) {
            console.error("Error downloading:", error);
            setIsDownloading(false);
            alert("Failed to download PDF. Please try again.");
        }
    };

    const isValidUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    };

    const handleOpenInEditor = async () => {
        if (isPremium && (!customer?.id || !customer?.metadata?.isPremium)) {
            alert("Upgrade to Pro to customize this premium template.");
            return;
        }

        let templateData = product.metadata?.template_data || product.metadata?.design_json;
        if (!templateData && (product as any).digital_product?.template_data != null) {
            templateData = (product as any).digital_product.template_data;
        }
        // Try digital-products via Next.js API (avoids CORS)
        if (!templateData && product.id) {
            try {
                const res = await fetch(`/api/products/${product.id}/digital-products`);
                if (res.ok) {
                    const { digital_products } = await res.json();
                    const dp = digital_products?.find((d: any) => d?.template_data != null);
                    if (dp?.template_data) {
                        if (dp.is_premium && (!customer?.id || !customer?.metadata?.isPremium)) {
                            alert("Upgrade to Pro to customize this premium template.");
                            return;
                        }
                        templateData = dp.template_data;
                    }
                }
            } catch (e) {
                console.error("Error fetching digital product:", e);
            }
        }
        // Fallback: fetch templates via Next.js API (avoids CORS)
        if (!templateData) {
            try {
                const res = await fetch("/api/templates");
                if (res.ok) {
                    const templates = await res.json();
                    const productTitle = (product.title || "").toLowerCase().trim();
                    const match = Array.isArray(templates)
                        ? templates.find((t: any) => t?.template_data && (
                            (t.name || "").toLowerCase().includes(productTitle) ||
                            productTitle.includes((t.name || "").toLowerCase())
                        ))
                        : null;
                    if (match?.template_data) {
                        if (match.is_premium && (!customer?.id || !customer?.metadata?.isPremium)) {
                            alert("Upgrade to Pro to customize this premium template.");
                            return;
                        }
                        templateData = match.template_data;
                    }
                }
            } catch (e) {
                console.error("Error fetching templates:", e);
            }
        }

        const saveTemplateAndNavigate = (templateToSave: object) => {
            if (isPremium && (!customer?.id || !customer?.metadata?.isPremium)) {
                alert("Upgrade to Pro to customize this premium template.");
                return;
            }
            const templateString = JSON.stringify(templateToSave);
            localStorage.setItem('polotno-template', templateString);
            onClose();
            setTimeout(() => router.push('/design-studio'), 50);
        };

        if (templateData) {
            try {
                if (typeof templateData === "string" && isValidUrl(templateData)) {
                    const response = await fetchs3json(templateData);
                    if (!response.success || !response.data) {
                        console.error("Failed to fetch template from URL:", templateData);
                        alert("Failed to load template. Please try again.");
                        return;
                    }
                    saveTemplateAndNavigate(response.data);
                } else {
                    const data = typeof templateData === "string" ? JSON.parse(templateData) : templateData;
                    saveTemplateAndNavigate(data);
                }
            } catch (e) {
                console.error("Error preparing template:", e);
                alert("Failed to load template. Please try again.");
            }
        } else {
            console.warn("No template data found, creating empty canvas");
            const emptyTemplate = {
                width: 800,
                height: 1000,
                pages: [{
                    id: 'page1',
                    children: [],
                    width: 800,
                    height: 1000,
                    background: 'white'
                }]
            };
            saveTemplateAndNavigate(emptyTemplate);
        }
    };

    return (
        <>
            {/* Download loader overlay */}
            {isDownloading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                        <p className="text-gray-700 font-medium">Preparing PDF...</p>
                    </div>
                </div>
            )}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-[1100px] max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                    {/* Right Side Action Buttons */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-black hover:bg-black/90 rounded-full flex items-center justify-center transition-colors shadow-lg"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={handleAddToFavorites}
                            className={`w-10 h-10 bg-white border-2 rounded-full flex items-center justify-center transition-colors shadow-lg ${isFavorite
                                ? "border-yellow-600 text-yellow-600 bg-yellow-50"
                                : "border-gray-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-600"
                                }`}
                            aria-label="Add to favourites"
                            title="Add to favourites"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                            </svg>
                        </button>
                        <button
                            onClick={handleShare}
                            className={`w-10 h-10 bg-white border-2 rounded-full flex items-center justify-center transition-colors shadow-lg ${shareCopied ? "border-green-500 text-green-600" : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"}`}
                            aria-label="Share template link"
                            title={shareCopied ? "Link copied!" : "Copy link to share"}
                        >
                            {shareCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5 text-gray-700" />}
                        </button>
                        <button
                            onClick={handleReportIssue}
                            className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center transition-colors shadow-lg hover:bg-gray-50 hover:border-gray-400"
                            aria-label="Report"
                            title="Report"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                                <path d="M12 9v4"></path>
                                <path d="M12 17h.01"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Left Side - Image */}
                    <div className="relative w-full md:w-[55%] bg-white flex items-center justify-center p-12 min-h-[300px] md:min-h-[500px] border-r border-gray-200 overflow-y-auto">
                        <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center p-8 border-2 border-gray-200">
                            {product.thumbnail ? (
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <div className="text-5xl font-bold mb-8 leading-tight">
                                        MAKE WHAT YOU<br />
                                        <span className="text-yellow-400">LOVE</span><br />
                                        WHAT YOU MAKE
                                    </div>
                                    <div className="text-8xl">✏️</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Content with scroll */}
                    <div className="w-full md:w-[45%] flex flex-col max-h-[90vh] md:max-h-full overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-8">
                            {/* Title + Pro badge */}
                            <div className="flex flex-wrap items-center gap-3 mb-5 pr-12">
                                <h2
                                    className="text-[32px] font-light leading-tight"
                                    style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                >
                                    {product.title}
                                </h2>
                                {isPremium && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium border border-amber-200">
                                        Pro
                                    </span>
                                )}
                            </div>

                            {/* Creator - Clickable */}
                            <button
                                onClick={handleCreatorClick}
                                className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity"
                            >
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                    {creatorAvatar ? (
                                        <img 
                                            src={creatorAvatar} 
                                            alt={creatorName || 'Creator'} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-gray-700">
                                            {(creatorName || 'L').charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="text-[16px] text-gray-500 hover:text-gray-700">
                                    Created by {creatorName || 'Loading...'}
                                </div>
                            </button>

                            {/* Description */}
                            <p className="text-gray-500 text-[16px] leading-relaxed mb-8 whitespace-pre-wrap">
                                {product.description ||
                                    "Master conversational Italian with this beginner-friendly guide. Includes common phrases, pronunciation tips, and practical dialogue scenarios for everyday situations."}
                            </p>

                            {/* Features */}
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-[16px] text-gray-600">
                                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span>Instant digital download</span>
                                </div>
                                <div className="flex items-center gap-3 text-[16px] text-gray-600">
                                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span>Fully editable content</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons - Fixed at bottom */}
                        <div className="p-8 pt-4 border-t border-gray-100 bg-white">
                            <div className="flex gap-3">
                                {/* Show Upgrade to Pro button if product is Pro and user is not Pro */}
                                {isPremium && (!customer?.id || !customer?.metadata?.isPremium) ? (
                                    <button
                                        onClick={() => setShowPremiumModal(true)}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 text-[15px]"
                                    >
                                        ⭐ Upgrade to Pro
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleDownload}
                                        className="flex-1 bg-black hover:bg-black/90 text-white font-medium py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 text-[15px]"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </button>
                                )}
                                {isPremium && (!customer?.id || !customer?.metadata?.isPremium) ? (
                                    <button
                                        onClick={() => setShowPremiumModal(true)}
                                        className="flex-1 border-2 border-purple-500 text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 font-medium py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 text-[15px]"
                                    >
                                        <SquarePen className="w-4 h-4" />
                                        Upgrade to customize
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleOpenInEditor}
                                        className="flex-1 border border-black/20 bg-white hover:bg-gray-50 text-black font-medium py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 text-[15px]"
                                    >
                                        <SquarePen className="w-4 h-4" />
                                        Make it Your Own
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Template Modal - same as design-studio; upgrade button closes modals and goes to profile */}
            <PremiumTemplateModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                customer={customer}
                primaryAction="profile"
                onUpgradeClick={() => {
                    setShowPremiumModal(false);
                    onClose();
                    router.push("/profile");
                }}
            />

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowReportModal(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Report Issue</h3>
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason
                                </label>
                                <select
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="">Select a reason</option>
                                    <option value="copyright">Copyright Infringement</option>
                                    <option value="inappropriate">Inappropriate Content</option>
                                    <option value="misleading">Misleading Information</option>
                                    <option value="quality">Quality Issues</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Details
                                </label>
                                <textarea
                                    value={reportDetails}
                                    onChange={(e) => setReportDetails(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                    placeholder="Please provide more details about the issue..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReport}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductModal;
