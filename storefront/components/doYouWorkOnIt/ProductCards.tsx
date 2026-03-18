"use client"
import "swiper/css"

import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import Products from "./Products"
import { motion } from "framer-motion"
import { FaRegStar } from "react-icons/fa"

function ProductCards({products}:any) {
  console.log(products, "any")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const ButtonsSkeleton = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 mb-8 container">
      <Skeleton className="w-full sm:w-[180px] h-[42px] rounded-lg" />
      <Skeleton className="w-full sm:w-[120px] h-[42px] rounded-lg" />
    </div>
  )

  const CardSkeleton = ({ type }: { type: "small" }) => (
    <div className="bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden col-span-12 sm:col-span-6 lg:col-span-3 h-[31em]">
      <div className="p-6 h-full flex flex-col">
        {/* Category Skeleton */}
        <Skeleton className="w-20 h-[11px] mb-2 mx-auto" />

        {/* Image Skeleton */}
        <div className="mb-4">
          <Skeleton className="w-full h-[240px] rounded-md" />
        </div>

        {/* Title Skeleton */}
        <Skeleton className="w-48 h-[20px] mb-2 mx-auto" />

        {/* Description Skeleton */}
        <Skeleton className="w-32 h-[16px] mb-6 mx-auto" />

        {/* Button Skeleton */}
        <div className="mt-auto flex justify-center">
          <Skeleton className="w-[100px] h-[42px] rounded-lg" />
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white pb-10">
        {/* Buttons Skeleton */}
        <ButtonsSkeleton />

        {/* First Row of Products */}
        <div className="container mb-6">
          <div className="grid grid-cols-12 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={`row1-${i}`} type="small" />
            ))}
          </div>
        </div>

        {/* Second Row of Products */}
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={`row2-${i}`} type="small" />
            ))}
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
          New resources <FaRegStar className="text-lg" />
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
