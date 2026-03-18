"use client"
import "swiper/css"

import Image from "next/image"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import leadingCommissionImg from "@/public/svg/leading-commisson-img.svg"
import sellIcon from "@/public/svg/sell-icon.svg"
import verifyAccountIcon from "@/public/svg/verify-account-icon.svg"
import differentiationIcon from "@/public/svg/differentiation-icon.svg"
import Link from "next/link"

// Card data array
const heroCards = [
  {
    id: 1,
    title: "Industry leading commission",
    description:
      "Unlike other resource marketplaces we don't charge a 20p transaction fee, meaning you keep more of your earnings to support your personal, department or school budget.",
    image: leadingCommissionImg,
    buttonText: "Upload a resource",
    buttonText1: "Start design",
    type: "large",
    link:"/dashboard/upload-a-resource",
    link1: "/design-editor"
  },
]

const creatorsCards = [
  {
    id: 1,
    title: "Sell more with StudyBlocks",
    description:
      "With our industry first print-on-demand service you can sell more than downloads for the first time, meaning you get commission based on the number of print sales not just on a single download!",
    image: sellIcon,
    type: "small",
    link:"/marketplace-for-educators"
  },
  {
    id: 2,
    title: "Verify your account",
    description:
      "Securely upload a form ID to have your account verified as a Studyblocks creator. Helping our community identify you as a trusted teacher.",
    image: verifyAccountIcon,
    type: "small",
    link:"/dashboard/profile"
  },
  {
    id: 3,
    title: "Differentiation made easy",
    description:
      "Support all students with our built-in AI tool, designed to differentiate and tailor content to meet diverse student needs.",
    image: differentiationIcon,
    type: "smal",
    link:"/"
  },
]

function LeadingCommission() {
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
            <Skeleton className="h-10 w-32 mx-auto lg:mx-0" />
          </div>

          {/* Desktop Image Skeleton */}
          <div className="hidden lg:block lg:w-[70%]">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )

  const CreatorCardSkeleton = () => (
    <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6">
      <div className="flex gap-4">
        {/* Icon skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="w-14 h-14 rounded" />
        </div>

        {/* Content skeleton */}
        <div className="flex flex-col flex-grow">
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white mb-5">
        <div className="container">
          {/* Creators Cards Skeleton */}
          <Skeleton className="h-10 w-64 mb-6" /> {/* Title skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((item) => (
              <CreatorCardSkeleton key={item} />
            ))}
          </div>
          {/* Leading Commission Card Skeleton */}
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
      className="relative bg-white"
    >
      {/* Creators cards */}
      <div className="container mb-8">
        <h2 className="text-[32px] font-bold text-black mb-6 leading-tight text-center lg:text-left">
          For creators and schools
        </h2>

        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {creatorsCards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[16px] border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-4">
                {/* Icon on the left */}
                <div className="flex-shrink-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="w-14 h-14 object-contain"
                  />
                </div>

                {/* Content on the right */}
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-500 font-medium text-[15px] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leading Commission cards */}
      <div className="container">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-12 gap-6"
        >
          {data.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 col-span-12 lg:col-span-12 h-fit md:h-fit lg:h-full w-full"
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
                      className="text-gray-500 text-[15px] leading-relaxed mb-6 font-medium text-center lg:text-left"
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
                      className="w-full lg:w-[13em] bg-[#E3E6EB] text-black font-bold py-2.5 px-6 rounded-lg transition-all text-[15px] hover:bg-opacity-90 hover:shadow-md mx-auto lg:mx-0"
                    >
                      {card.buttonText}
                    </motion.button>
                    </Link>
                    <Link href={card.link1}>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full lg:w-[13em] bg-[#E3E6EB] text-black font-bold py-2.5 px-6 rounded-lg transition-all text-[15px] hover:bg-opacity-90 hover:shadow-md mx-auto lg:mx-0 mt-6"
                    >
                      {card.buttonText1}
                    </motion.button>
                    </Link>
                  </div>

                  {/* Desktop Image */}

                  <Image
                    src={card.image}
                    alt="Design and print"
                    // fill
                    className="object-contain hidden lg:block lg:w-[70%] relative h-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default LeadingCommission
