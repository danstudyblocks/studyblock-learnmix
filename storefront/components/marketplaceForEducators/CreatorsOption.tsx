"use client"
import "swiper/css"

import Image from "next/image"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import sellIcon from "@/public/svg/sell-icon.svg"
import verifyAccountIcon from "@/public/svg/verify-account-icon.svg"
import differentiationIcon from "@/public/svg/differentiation-icon.svg"
import findResourceIcon from "@/public/svg/find-resource-icon.svg"
import shopIcon from "@/public/svg/shop-icon.svg"
import supportIcon from "@/public/svg/supperting-icon.svg"
import saveIcon from "@/public/svg/save-icon.svg"
import makeMoneyIcon from "@/public/svg/make-money-icon.svg"

const creatorsCards = [
  {
    id: 1,
    title: "Find the best resources",
    description:
      "Find exclusive, high-quality  classroom resources effortlessly with our marketplace: big previews, various buying options, and verified creators.",
    image: findResourceIcon,
    type: "small",
  },
  {
    id: 2,
    title: "Shop with confidence",
    description:
      "All resources are created by teachers for teachers, ensuring quality and suitability. Plus, we accept school purchase orders for hassle-free transactions.",
    image: shopIcon,
    type: "small",
  },
  {
    id: 3,
    title: "Supporting students  with every sale",
    description:
      "Every sale supports teachers and schools, boosting budgets and enhancing positive outcomes for students.",
    image: supportIcon,
    type: "smal",
  },
  {
    id: 4,
    title: "Save time and money",
    description:
      "With our industry-first, affordable, print-on-demand service, transform your favourite resources into high-quality prints, perfect for the classroom.",
    image: saveIcon,
    type: "small",
  },
  {
    id: 5,
    title: "Your AI partner",
    description:
      "Say goodbye to creator's block! Effortlessly generate new content with our free AI tools, crafted by teachers for teachers.",
    image: sellIcon,
    type: "small",
  },
  {
    id: 6,
    title: "Create like a Pro!",
    description:
      "Craft professional-quality resources effortlessly using our resource editor. With over 10,000 educational templates and assets, you'll never start from scratch again.",
    image: verifyAccountIcon,
    type: "smal",
  },
  {
    id: 7,
    title: "Differentiation made easy",
    description:
      "Support all students with our built-in AI tool, designed to differentiate and tailor content to meet diverse student needs.",
    image: differentiationIcon,
    type: "small",
  },
  {
    id: 8,
    title: "Make money with StudyBlocks",
    description:
      "Love your new resource? Share it on our marketplace to support colleagues and boost your budget!",
    image: makeMoneyIcon,
    type: "smal",
  },
]

function CreatorsOption() {
  const [isLoading, setIsLoading] = useState(true)

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

//   const buttonVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         delay: 0.6,
//       },
//     },
//   }

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const CreatorCardSkeleton = () => (
    <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6">
      <div className="flex gap-3">
        {/* Icon skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="w-12 h-12 rounded" />
        </div>

        {/* Content skeleton */}
        <div className="flex flex-col flex-grow">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white mb-5">
        <div className="container">
          {/* Creators Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <CreatorCardSkeleton key={item} />
            ))}
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
        {/* cards - updated to 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[22px]">
          {creatorsCards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[16px] border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-3">
                {/* Icon on the left */}
                <div className="flex-shrink-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>

                {/* Content on the right */}
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-bold mb-1.5">{card.title}</h3>
                  <p className="text-gray-500 font-medium text-[13px] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default CreatorsOption
