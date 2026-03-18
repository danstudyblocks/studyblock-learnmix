"use client"
import "swiper/css"
import dummyCommunityImg from "@/public/gif/assignment.gif"
import shopNowImg from "@/public/svg/shopNow-img.svg"
import startDesigningImg from "@/public/svg/start-designing-img.svg"
import Image from "next/image"
import { FaAngleRight } from "react-icons/fa6"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import Link from "next/link"

// Card data array
const heroCards = [
  {
    id: 1,
    title: "Create, Share, Earn today!",
    image: dummyCommunityImg,
    description:
      "Join a thriving community of educators transforming their classroom impact by creating and monetising innovative educational resources with StudyBlocks.",
    buttonText: "Join the community",
    type: "large",
    link: "/dashboard/upload-a-resource"
  },
  {
    id: 2,
    title: "Powered by teachers, for teachers",
    image: shopNowImg,
    description:
      "Find exclusive, high-quality learning resources created by teachers just like you from around the world.",
    buttonText: "Shop now",
    type: "small",
    link: "/shop"
  },
  {
    id: 3,
    title: "Design Editor",
    image: startDesigningImg,
    description:
      "Edit our templates or create your own professional learning resources to share, sell and print.",
    buttonText: "Start designing",
    type: "small",
    link: "/design-studio"
  },
]

function HeroSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [data] = useState(heroCards)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // const buttonVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.5,
  //       delay: 0.6,
  //     },
  //   },
  // }

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const CardSkeleton = ({ type }: { type: "small" | "large" }) => (
    <div
      className={`bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden ${
        type === "large"
          ? "col-span-12 lg:col-span-5 h-[28em] sm:h-[32em] lg:h-[36em]"
          : "col-span-12 h-full sm:h-full"
      }`}
    >
      <div className="p-6 sm:p-8 h-full flex flex-col">
        {type === "large" ? (
          <>
            <Skeleton className="h-48 sm:h-56 lg:h-64 w-full mb-6 rounded-lg" />
            <Skeleton className="h-8 sm:h-10 w-3/4 mb-4" />
            <Skeleton className="h-20 sm:h-24 w-full mb-6" />
            <Skeleton className="h-10 sm:h-12 w-36 sm:w-48 mt-auto" />
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Image Skeleton - Top on mobile/tablet, Right on desktop */}
            <div className="w-full lg:w-[45%] order-1 lg:order-2">
              <Skeleton className="h-48 sm:h-56 w-full rounded-lg" />
            </div>

            {/* Content Skeleton - Bottom on mobile/tablet, Left on desktop */}
            <div className="flex-1 order-2 lg:order-1 flex flex-col items-center lg:items-start">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white pt-20 sm:pt-24 lg:pt-32 pb-[22px]">
        <div className="container">
          <div className="grid grid-cols-12 gap-[22px] sm:gap-6">
            {/* Left large skeleton */}
            <CardSkeleton type="large" />

            {/* Right side skeletons container */}
            <div className="col-span-12 lg:col-span-7 grid grid-cols-1 gap-4 sm:gap-6">
              <CardSkeleton type="small" />
              <CardSkeleton type="small" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative bg-white pt-20 sm:pt-24 lg:pt-32 pb-[22px]"
    >
      <div className="container">
        <div className="grid grid-cols-12 gap-[22px] sm:gap-6">
          {/* Left large card */}
          {data
            .filter((card) => card.type === "large")
            .map((card) => (
              <motion.div
                key={card.id}
                variants={cardVariants}
                className="col-span-12 lg:col-span-5"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-[16px] border-2 border-gray-200 p-6 sm:p-8 h-full hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-48 sm:h-56 lg:h-64 mb-6">
                    <Image
                      src={card.image}
                      alt="Community"
                      fill
                      priority
                      className="object-contain"
                      unoptimized
                    />
                  </div>

                  <div className="flex flex-col h-full">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl sm:text-3xl lg:text-[28px] font-bold text-black mb-3 sm:mb-4"
                    >
                      {card.title}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-sm sm:text-base lg:text-lg font-medium mb-6 sm:mb-8"
                    >
                      {card.description}
                    </motion.p>
                    <Link href={card.link} >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-fit bg-[#0765FF] text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg text-sm sm:text-base lg:text-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
                    >
                      <FaAngleRight className="text-lg" />
                      {card.buttonText}
                    </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}

          {/* Right side cards */}
          <motion.div
            variants={cardVariants}
            className="col-span-12 lg:col-span-7 grid grid-cols-1 gap-4 sm:gap-6"
          >
            {data
              .filter((card) => card.type === "small")
              .map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-[16px] border-2 border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Image - Top on mobile/tablet, Left on desktop */}
                    <div className="w-full md:w-[40%] lg:w-[45%] order-1 lg:order-2">
                      <Image
                        src={card.image}
                        alt={card.title}
                        priority
                        className="object-contain w-full h-auto"
                      />
                    </div>

                    {/* Content - Bottom on mobile/tablet, Right on desktop */}
                    <div className="flex-1 order-2 lg:order-1">
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4 text-center lg:text-left"
                      >
                        {card.title}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 text-sm sm:text-base mb-6 font-medium text-center lg:text-left"
                      >
                        {card.description}
                      </motion.p>
                      <div className="flex justify-center lg:justify-start">
                        <Link href={card.link}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-fit bg-gray-100 text-black font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg text-sm hover:bg-gray-200 transition-all"
                        >
                          {card.buttonText}
                        </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default HeroSection
