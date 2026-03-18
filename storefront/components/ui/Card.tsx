"use client";

import badge from "@/public/images/verify-badge.png";
import {
    PiCaretLeft,
    PiCaretRight,
    PiHeart,
    PiPaperPlaneTilt,
} from "react-icons/pi";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import PreviewPrice from "@/modules/products/components/product-preview/price";
import { fetchLinkedCreator } from "@/lib/data/vendor";
import { useEffect, useState } from "react";
import { HttpTypes } from "@medusajs/types";

function Card({
    p,
}: {
    p: {
        id: string;
        thumbnail: string;
        title: string;
        description: string;
        subtitle: string;
        handle: string;
        images: any[];
        region: any;
        cheapestPrice: any;
    };
}) {
    const {
        id,
        title,
        description,
        subtitle,
        handle,
        images,
        cheapestPrice,
    } = p;

    const [creator, setCreator] = useState<HttpTypes.StoreCustomer | null>(null);
    const [creatorImg, setCreatorImg] = useState(null)
    const [loadingCreator, setLoadingCreator] = useState(true);
    const [creatorError, setCreatorError] = useState("");

    useEffect(() => {
        const loadCreator = async () => {
            setLoadingCreator(true);
            try {
                const response = await fetchLinkedCreator(id);
                if (response.success) {
                    setCreator(response.creator);
                    setCreatorImg(response?.creator?.metadata?.avatar_url)
                } else {
                    setCreatorError(response.error || "Unable to fetch creator.");
                }
            } catch {
                setCreatorError("An unexpected error occurred.");
            } finally {
                setLoadingCreator(false);
            }
        };

        if (id) {
            loadCreator();
        }
    }, [id]);

    const truncateText = (text: string, wordLimit: number) => {
        if (!text) return "";
        const words = text.split(" ");
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + "..."
            : text;
    };

    return (
        <div className="flex flex-col gap-1 rounded-3xl border border-n40 bg-n10 py-4">
            <Link href={`/products/${handle}`}>
                <h6 className="heading-6 text-center font-bold text-n900">
                    {title}
                </h6>
            </Link>
            <div className="flex items-center justify-start gap-3 px-3">
                <div className="max-md:overflow-hidden">
                    <Link href={`/products/${handle}`}>
                    {
                            creatorImg ? <Image
                                src={creatorImg || badge}
                                alt="Creator Img"
                                className="w-[48px] h-[48px] rounded-full border-2 border-n700 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                width={48}
                                height={48}
                            /> : <Image
                                src={badge}
                                alt="Shop"
                                className="w-[48px] max-sm:w-[72px]"
                            />
                        }
                    </Link>
                </div>
                <div className="max-[350px]:max-w-20">
                    <div className="flex items-center justify-start gap-3">
                        <p className="text-sm font-semibold">
                            {loadingCreator
                                ? "Loading..."
                                : creator
                                ? `${creator.first_name} ${creator.last_name}`
                                : "Studyblocks"}
                        </p>
                        <p className="rounded-full bg-y300 px-2 py-1 text-xs font-medium">
                            PRO
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col px-3 items-center">
                <Link href={`/products/${handle}`}>
                    <p className="pt-2 text-n500">
                        {truncateText(subtitle || description, 5)}
                    </p>
                </Link>
                {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
            <div className="flex flex-wrap gap-2 px-3 text-[13px]">
                <p className="rounded-full bg-r50 px-2 py-1 font-medium text-r300">
                    Postcard
                </p>
                <p className="rounded-full bg-g50 px-2 py-1 font-medium text-g400">
                    Achievement
                </p>
            </div>
            <div className="relative">
                <Swiper
                    loop={true}
                    slidesPerView={"auto"}
                    spaceBetween={12}
                    navigation={{
                        nextEl: ".ara-next",
                        prevEl: ".ara-prev",
                    }}
                    modules={[FreeMode, Navigation]}
                    className="swiper expert-slider-carousel group"
                >
                    {images.map((item, i) => (
                        <SwiperSlide className="swiper-wrapper" key={i}>
                            <Link href={`/products/${handle}`}>
                                <Image
                                    src={item.url}
                                    alt="Product image"
                                    layout="intrinsic"
                                    width={item.width || 500}
                                    height={item.height || 500}
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                    <div className="absolute left-2 right-2 top-28 z-10">
                        <div className="flex w-full items-center justify-between">
                            <button className="ara-prev flex -translate-x-12 items-center justify-center rounded-full border-2 border-r300 p-2 text-lg !leading-none text-r300 opacity-0 duration-500 hover:bg-r300 hover:text-white group-hover:translate-x-0 group-hover:opacity-100">
                                <PiCaretLeft />
                            </button>
                            <button className="ara-next flex translate-x-12 items-center justify-center rounded-full border-2 border-r300 p-2 text-lg !leading-none text-r300 opacity-0 duration-500 hover:bg-r300 hover:text-white group-hover:translate-x-0 group-hover:opacity-100">
                                <PiCaretRight />
                            </button>
                        </div>
                    </div>
                </Swiper>
            </div>
            <div className="flex items-center justify-start gap-2 px-3">
                <Link
                    href={`/products/${handle}`}
                    className="relative w-full overflow-hidden rounded-full bg-n700 px-3 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
                >
                    <div className="relative z-20 flex items-center justify-center gap-3">
                        <PiPaperPlaneTilt className="text-xl !leading-none" />
                        <span>Buy now</span>
                    </div>
                </Link>
                <button className="relative flex items-center justify-center rounded-full border p-3 text-xl !leading-none duration-500 hover:bg-y300">
                    <PiHeart />
                </button>
            </div>
        </div>
    );
}

export default Card;
