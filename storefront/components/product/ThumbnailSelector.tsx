"use client"; 

import { useState } from "react";
import Image from "next/image";

type ThumbnailSelectorProps = {
    thumbnail: string;
    images: { url: string }[];
};

const ThumbnailSelector: React.FC<ThumbnailSelectorProps> = ({ thumbnail, images }) => {
    const [selectedImage, setSelectedImage] = useState(thumbnail);
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);

    // Combine thumbnail with other images for the gallery
    const allImages = images.length > 0 ? images : [{ url: thumbnail }];

    // Use hovered image if available, otherwise use selected image
    const displayImage = hoveredImage || selectedImage;

    return (
        <div className="col-span-12 md:col-span-7 lg:col-span-8">
            {/* Main Image Container */}
            <div className="mb-4 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                <div className="relative aspect-[4/3] w-full">
                    <Image
                        src={displayImage}
                        className="object-contain w-full h-full transition-all duration-300"
                        alt="Product thumbnail"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    />
                </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {allImages.map((image, index) => (
                        <div
                            key={index}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                                selectedImage === image.url 
                                    ? "border-b300 shadow-lg ring-2 ring-b300/20" 
                                    : "border-gray-200 hover:border-b300 hover:shadow-md hover:ring-1 hover:ring-b300/10"
                            }`}
                            onMouseEnter={() => setHoveredImage(image.url)}
                            onMouseLeave={() => setHoveredImage(null)}
                            onClick={() => setSelectedImage(image.url)}
                        >
                            <Image
                                src={image.url}
                                className="w-full h-full object-cover"
                                alt={`Thumbnail ${index + 1}`}
                                width={64}
                                height={64}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThumbnailSelector;
