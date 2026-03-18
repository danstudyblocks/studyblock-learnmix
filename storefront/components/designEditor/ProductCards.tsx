"use client"

import "swiper/css"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import Products from "./Products"
import { motion } from "framer-motion"
import { FaRegStar } from "react-icons/fa"

function ProductCards({products}:any) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const CardSkeleton = ({ type }: { type: "small" }) => (
    <div
      className={`bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden col-span-12 sm:col-span-6 lg:col-span-3 h-[31em]`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Category Skeleton */}
        <Skeleton className="w-24 h-4 mb-4 mx-auto" />

        {/* Image Skeleton */}
        <Skeleton className="w-full h-[240px] mb-6 rounded-md" />

        {/* Title Skeleton */}
        <Skeleton className="w-3/4 h-6 mb-4 mx-auto" />

        {/* Description Skeleton */}
        <Skeleton className="w-1/2 h-5 mb-6 mx-auto" />

        {/* Button Skeleton */}
        <Skeleton className="w-24 h-10 mx-auto" />
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white pt-10 pb-5">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <CardSkeleton type="small" />
            <CardSkeleton type="small" />
            <CardSkeleton type="small" />
            <CardSkeleton type="small" />
          </div>
        </div>
      </section>
    )
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.6,
      },
    },
  }

  return (
    <>
      {/* Buttons Section - Moved to top */}
      <motion.div
        variants={buttonVariants}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 mb-8 container"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto bg-[#0765FF] hover:bg-opacity-80 text-white font-medium flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg transition-all text-[15px] font-semibold hover:shadow-md"
        >
          New downloads <FaRegStar className="text-lg" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-6 rounded-lg transition-all text-[15px] font-semibold hover:shadow-md"
        >
          View all
        </motion.button>
      </motion.div>
      <Products products={products} />
    </>
  )
}

export default ProductCards
