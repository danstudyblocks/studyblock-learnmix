"use client";

import { useState } from "react";
import { SquarePen, Star, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "../editor-page/UserMenu";
import ProductModal from "../editor-page/ProductModal";

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

interface MyResourcesPageProps {
    customer: any;
    products: Product[];
}

const MyResourcesPage = ({ customer, products }: MyResourcesPageProps) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 300);
    };

    const handleDelete = (id: string) => {
        // TODO: Implement delete functionality
        console.log("Delete resource:", id);
    };

    return (
        <div className="flex w-full min-h-screen">
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col w-full">
                    <div className="h-px"></div>
                    
                    {/* Header */}
                    <div className="border-b ml-[2px] bg-[rgb(252,250,248)] border-black/0 p-4">
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
                            <div className="text-center pt-[0px] pr-[0px] pb-[25px] pl-[0px]">
                                <div className="items-center flex flex-col text-center gap-[24px] pt-2 pr-0 pb-0 pl-0">
                                    
                                    {/* Profile Section */}
                                    <div className="flex flex-col items-center gap-4 mt-6">
                                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-100">
                                            {customer?.metadata?.avatar_url ? (
                                                <Image
                                                    src={customer.metadata.avatar_url}
                                                    alt={customer.first_name || "User"}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl font-semibold text-gray-600">
                                                    {customer?.first_name?.charAt(0) || customer?.email?.charAt(0) || 'U'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <h2 className="text-2xl font-medium">
                                                {customer?.first_name ? `${customer.first_name} ${customer.last_name || ''}` : 'User'}
                                            </h2>
                                            <p className="text-gray-600 text-sm">
                                                {products.length} Resource{products.length !== 1 ? 's' : ''} Created
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex gap-2">
                                            <Link
                                                href="/profile"
                                                className="px-4 py-2 text-sm border border-black/20 bg-white text-black rounded-full hover:bg-gray-50 transition-colors"
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/favourites"
                                                className="px-4 py-2 text-sm border border-black/20 bg-white text-black rounded-full hover:bg-gray-50 transition-colors"
                                            >
                                                My Favourites
                                            </Link>
                                        </div>
                                        <div>
                                            <a
                                                href="mailto:hello@learnmix.com"
                                                className="px-4 py-2 text-sm border border-black/20 bg-white text-black rounded-full hover:bg-gray-50 transition-colors"
                                            >
                                                Help
                                            </a>
                                        </div>
                                    </div>

                                    {/* Page Title */}
                                    <h1 
                                        className="font-light text-center w-full text-[30px] leading-[45px]"
                                        style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                    >
                                        My Resources
                                    </h1>
                                </div>
                            </div>

                            {/* Resources Grid */}
                            <div className="flex flex-col text-left gap-[32px] mt-8">
                                <div className="grid text-left gap-[16px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {products.map((product) => (
                                        <div key={product.id}>
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
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => handleViewProduct(product)}
                                                                className="flex items-center justify-center gap-1 flex-1 border border-black/20 bg-transparent text-black px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors text-[12px] leading-[16px]"
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                View
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(product.id)}
                                                                className="flex items-center justify-center gap-1 flex-1 border border-red-500 bg-transparent text-red-500 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors text-[12px] leading-[16px]"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
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
        </div>
    );
};

export default MyResourcesPage;
