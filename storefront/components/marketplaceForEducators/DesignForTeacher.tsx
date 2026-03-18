"use client"

import "swiper/css"
import Image from "next/image"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import startDesignQuoteImg from "@/public/svg/start-design-quote-img.svg"
import Link from "next/link"

// Card data array
const heroCards = [
  {
    id: 1,
    title: "Free professional design for teachers",
    description: "For a limited time, educators worldwide can access our free graphic design service. Upload your resource and get it enhanced with professional design and AI, free of charge!",
    image: startDesignQuoteImg,
    buttonText: "Upload a resource",
    type: "large",
    link: "/design-editor"
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
    <div className="bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden col-span-12 lg:col-span-12 h-fit md:h-fit lg:h-[21em] w-full">
      <div className="p-6 h-full">
        {/* Mobile/Tablet Image Skeleton */}
        <div className="block lg:hidden mb-6">
          <Skeleton className="h-48 md:h-64 w-full rounded-lg" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Content Skeleton */}
          <div className="flex flex-col flex-1">
            <Skeleton className="h-10 w-3/4 mb-4 mx-auto lg:mx-0" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-10 w-32 mx-auto lg:mx-0 mb-6" />
          </div>

          {/* Desktop Image Skeleton */}
          <div className="hidden lg:block lg:w-[70%]">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white mb-10">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <CardSkeleton type="large" />
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
      className="relative bg-white mb-10 mt-10"
    >
      <div className="container">
        <motion.div variants={containerVariants} className="grid grid-cols-12 gap-[22px]">
          {data.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 col-span-12 lg:col-span-12 h-fit md:h-fit lg:h-full w-full"
            >
              <div className="flex flex-col h-full p-6">
                {/* Mobile/Tablet Image */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="block lg:hidden relative h-48 md:h-64 mb-6"
                >
                  <Image
                    src={card.image}
                    alt="Design and print"
                    fill
                    className="object-contain"
                  />
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6 h-full">
                  {/* Text Content */}
                  <div className="flex flex-col flex-1">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-[32px] font-bold text-black mb-4 leading-tight text-center lg:text-left"
                    >
                      {card.title}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-gray-600 text-[15px] leading-relaxed mb-6 text-center lg:text-left font-medium"
                    >
                      {card.description}
                    </motion.p>
                    <Link href={card.link}>
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full lg:w-[13em] bg-[#E3E6EB] text-black font-bold py-2.5 px-6 rounded-lg transition-all text-[15px] hover:bg-opacity-90 hover:shadow-md mx-auto lg:mx-0 mb-6"
                      >
                        {card.buttonText}
                      </motion.button>
                    </Link>
                  </div>

                  {/* Desktop Image */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="hidden lg:block lg:w-[70%] relative h-[300px]"
                  >
                    <Image
                      src={card.image}
                      alt="Design and print"
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default DesignForTeacher;
