"use client"

import "swiper/css"
import shopNowImg from "@/public/svg/shopNow-img.svg"
import startDesigningImg from "@/public/svg/start-designing-img.svg"
import Image from "next/image"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import dummyDesignerEditorImg from "@/public/svg/dummy-designer-editor-img.svg"

// Card data array
const heroCards = [
  {
    id: 1,
    title: "Free design for teachers",
    image: dummyDesignerEditorImg,
    description:
      "For a limited time, educators worldwide can access our free graphic design service. Upload your resource and get it enhanced with professional design and AI, ",
    highlight: "for free!",
    buttonText: "Upload a resource",
    type: "large",
  },
  {
    id: 2,
    title: "Powered by teachers, for teachers",
    image: shopNowImg,
    description:
      "Find exclusive, high-quality learning resources created by teachers just like you from around the world.",
    buttonText: "Shop now",
    type: "small",
  },
  {
    id: 3,
    title: "Design Editor",
    image: startDesigningImg,
    description:
      "Make a start on designing your very own bespoke exercise book with our handy templates, or work with one of our designers for free!",
    buttonText: "Start designing",
    type: "small",
  },
]

function DesignForTeacher() {
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
          : "col-span-12 h-[20em] sm:h-[16em]"
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
          <div className="flex flex-col sm:flex-row gap-6 h-full">
            {/* Image Skeleton - First on mobile, Right on desktop */}
            <div className="w-full sm:w-1/3 lg:w-2/5 order-first sm:order-last">
              <Skeleton className="h-32 sm:h-full w-full rounded-lg" />
            </div>

            {/* Content Skeleton - Second on mobile, Left on desktop */}
            <div className="flex-1 order-last sm:order-first flex flex-col items-center sm:items-start">
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
      <section className="relative bg-white mt-5 pb-10">
        <div className="container">
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
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
      className="relative bg-white pb-10 mt-5"
    >
      <div className="container">
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* Left large card */}
          {data.filter(card => card.type === "large").map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              className="col-span-12 lg:col-span-5"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-[16px] border-2 border-gray-200 p-6 sm:p-8 h-full hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-48 sm:h-56 lg:h-60 mb-6">
                  <Image
                    src={card.image}
                    alt="Community"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-col h-full">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4"
                  >
                    {card.title}
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 font-medium"
                  >
                    {card.description}
                    <span className="font-bold text-[#0765FF]">{card.highlight}</span>
                  </motion.p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-fit bg-gray-100 text-gray-800 font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg text-sm hover:bg-gray-200 transition-all"
                  >
                    {card.buttonText}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* Right side cards */}
          <motion.div
            variants={cardVariants}
            className="col-span-12 lg:col-span-7 grid grid-cols-1 gap-4 sm:gap-6"
          >
            {data.filter(card => card.type === "small").map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-[16px] border-2 border-gray-200 p-6 sm:p-8 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Image - First on mobile, Right on desktop */}
                  <div className={`w-full sm:w-1/3 ${card.id === 3 ? 'lg:w-3/5' : 'lg:w-2/5'} aspect-square relative order-first sm:order-last`}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>

                  {/* Content - Second on mobile, Left on desktop */}
                  <div className="flex-1 order-last sm:order-first">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4 text-center sm:text-left"
                    >
                      {card.title}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-sm sm:text-base mb-6 font-medium text-center sm:text-left"
                    >
                      {card.description}
                    </motion.p>
                    <div className="flex justify-center sm:justify-start">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-fit bg-gray-100 text-gray-800 font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg text-sm hover:bg-gray-200 transition-all"
                      >
                        {card.buttonText}
                      </motion.button>
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

export default DesignForTeacher
