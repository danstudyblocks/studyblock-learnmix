"use client";

import { useState, useEffect } from "react";
import { SquarePen, User, Star, Search } from "lucide-react";
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

interface FavouritesPageProps {
    customer: any;
    products: Product[];
}

const FavouritesPage = ({ customer, products }: FavouritesPageProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = ["All", "Worksheets", "Posters", "Postcards", "Stickers", "Workbooks", "Presentation"];

    // Load favorites from localStorage on mount
    useEffect(() => {
        const storedFavorites = localStorage.getItem(`favorites_${customer?.id}`);
        if (storedFavorites) {
            try {
                setFavouriteIds(JSON.parse(storedFavorites));
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        }
    }, [customer?.id]);

    // Filter products to show only favorites
    const favouriteProducts = products.filter(product => favouriteIds.includes(product.id));

    // Filter by search query
    const filteredProducts = favouriteProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 300);
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
                                                {favouriteProducts.length} Favourite Resource{favouriteProducts.length !== 1 ? 's' : ''}
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
                                                href="/my-resources"
                                                className="px-4 py-2 text-sm border border-black/20 bg-white text-black rounded-full hover:bg-gray-50 transition-colors"
                                            >
                                                My Resources
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
                                        My Favourite Resources
                                    </h1>

                                    {/* Search Bar */}
                                    <div className="text-center w-full">
                                        <div className="items-center border flex text-center w-full max-w-full bg-white border-[rgb(221,215,213)] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0.05)_0px_1px_2px_0px] h-[50px] gap-[12px] pr-4 pl-4 rounded-[0.9375rem]">
                                            <Search 
                                                aria-label="Search icon"
                                                className="text-[rgb(115,115,115)] w-4 shrink-0"
                                            />
                                            <input
                                                placeholder="Search favourites"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="border-black/0 grow text-left w-full bg-white/0 border-[0px] text-[16px] leading-[24px] p-0 placeholder:text-[rgb(115,115,115)] focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Category Pills */}
                                    <div className="flex gap-2 flex-wrap justify-center">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setActiveCategory(category)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                                    activeCategory === category
                                                        ? "bg-black text-white"
                                                        : "bg-stone-100/60 text-gray-700 hover:bg-stone-200/60"
                                                }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Empty State */}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-16">
                                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 
                                        className="text-xl font-light mb-2"
                                        style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                    >
                                        {searchQuery ? "No matching favourites" : "No favourites yet"}
                                    </h3>
                                    <p className="text-gray-600">
                                        {searchQuery 
                                            ? "Try a different search term"
                                            : "Click the star icon on any resource to add it to your favourites"
                                        }
                                    </p>
                                </div>
                            )}

                            {/* Favourites Grid */}
                            {filteredProducts.length > 0 && (
                                <div className="grid text-left gap-[16px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                                    {filteredProducts.map((product) => (
                                        <div key={product.id} style={{ opacity: 1, transform: "none" }}>
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
                                                        <div role="none" className="text-left w-full h-[0.5px] bg-[rgb(221,_215,_213)]"></div>
                                                    </div>
                                                    <div className="text-left p-4">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <button 
                                                                onClick={() => handleViewProduct(product)}
                                                                className="flex items-center justify-center flex-1 border border-black/20 bg-transparent text-black px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors text-[12px] leading-[16px]"
                                                            >
                                                                View
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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

export default FavouritesPage;
