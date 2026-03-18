"use client";

import { useState } from "react";
import { Star, FileImage, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductModal from "../editor-page/ProductModal";

interface Product {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    metadata?: {
        is_pro?: boolean;
        creator_name?: string;
        creator_id?: string;
    };
}

interface Creator {
    id: string;
    name: string;
    bio: string;
    avatar?: string;
    store_description?: string;
}

const INITIAL_PAGE_SIZE = 12;

interface CreatorStorefrontProps {
    creator: Creator;
    products: Product[];
    customer: any;
    initialPageSize?: number;
}

const CreatorStorefront = ({
    creator,
    products,
    customer,
    initialPageSize = INITIAL_PAGE_SIZE,
}: CreatorStorefrontProps) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayCount, setDisplayCount] = useState(initialPageSize);

    const displayedProducts = products.slice(0, displayCount);
    const hasMore = displayCount < products.length;

    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 300);
    };

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + initialPageSize);
    };

    return (
        <div className="min-h-screen bg-[#FCFAF8]">
            {/* Header */}
            <div className="border-b bg-[#FCFAF8]">
                <div className="container mx-auto px-4 py-4">
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Editor
                    </Link>
                </div>
            </div>

            {/* Creator Profile Section */}
            <div className="bg-[#FCFAF8] border-b border-black/10">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                            {creator.avatar ? (
                                <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-white">
                                    {creator.name.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{creator.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{products.length} resources</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Store Description */}
                    {creator.store_description && (
                        <div className="mt-4">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {creator.store_description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Resources by {creator.name}</h2>
                    <p className="text-gray-600 mt-2">Browse all educational resources created by this educator</p>
                </div>

                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayedProducts.map((product) => (
                                <div key={product.id} className="group">
                                    <div className="border text-left bg-white border-black/20 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
                                        <div className="text-left">
                                            <div className="text-left">
                                                <div className="text-left w-full p-2 rounded-[0.625rem] relative">
                                                    {product.metadata?.is_pro && (
                                                        <span className="absolute top-3 right-3 bg-white text-black text-[10px] font-semibold px-2 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-black" />
                                                            PRO
                                                        </span>
                                                    )}
                                                    {product.thumbnail && (
                                                        <img
                                                            alt={product.title}
                                                            src={product.thumbnail}
                                                            className="block size-full max-w-full object-cover overflow-clip text-left align-middle aspect-[3/4] rounded-[0.625rem]"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-left">
                                                    <p 
                                                        className="border-b border-t inline-block font-light text-left w-full border-black/0 leading-[24px] p-4 min-h-[72px] flex items-center"
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

                        {/* Load More */}
                        {hasMore && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    className="inline-flex items-center justify-center font-medium h-10 px-6 py-2 rounded-full border border-black/20 bg-white hover:bg-gray-50 transition-colors text-[14px]"
                                >
                                    Load More ({products.length - displayCount} remaining)
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No resources found</p>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <ProductModal 
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                customer={customer}
            />
        </div>
    );
};

export default CreatorStorefront;
