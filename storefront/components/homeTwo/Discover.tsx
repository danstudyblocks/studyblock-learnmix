"use client"

import "swiper/css"
import discoverNowImg from "@/public/svg/discover-now-img.svg"
import Image from "next/image"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import discoverImg1 from "@/public/svg/discover-img-1.svg"

// Card data array
const heroCards = [
  {
    id: 1,
    title: "Share and sell your designs with ease",
    description:
      "Share your new design to the StudyBlocks marketplace to share and sell your resources with our growing community of educators. It's a great way of supporting your personal, classroom or school budget.",
    image: discoverNowImg,
    buttonText: "Discover now",
    type: "large",
  },
  {
    id: 2,
    title: "Create with AI",
    description: (
      <>Redefine how you create new learning content with StudyBlocks AI. <br/><br/>Our AI tools are built into the design editor so you can quickly create, edit and differentiation learning content.</>
    ),
    image: discoverImg1,
    buttonText: "Discover now",
    type: "small",
  },
]

function Discover() {
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
          ? "col-span-12 lg:col-span-6 h-[24em] md:h-[28em] lg:h-[21em]"
          : "col-span-12 lg:col-span-6 h-[24em] md:h-[28em] lg:h-[21em]"
      }`}
    >
      <div className="p-6 h-full">
        <div className="flex flex-col h-full">
          {/* Mobile/Tablet Image Skeleton */}
          <div className="block lg:hidden mb-6">
            <Skeleton className="h-48 md:h-64 w-full rounded-lg" />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Content Skeleton */}
            <div className="flex flex-col flex-1">
              <div className="mb-6">
                <Skeleton className="h-8 w-3/4 mb-4 mx-auto lg:mx-0" />
                <Skeleton className="h-24 w-full mb-6" />
              </div>
              <div className="mt-auto flex justify-center lg:justify-start">
                <Skeleton className="h-10 w-full lg:w-32" />
              </div>
            </div>

            {/* Desktop Image Skeleton */}
            <div className="hidden lg:block lg:w-[45%]">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white py-10">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <CardSkeleton type="large" />
            <CardSkeleton type="small" />
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
      className="relative bg-white py-10"
    >
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
              className={`bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 ${
                card.type === "large"
                  ? "col-span-12 lg:col-span-6 h-fit md:h-fit lg:h-full"
                  : "col-span-12 lg:col-span-6 h-fit md:h-fit lg:h-full"
              }`}
            >
              {card?.id === 1 ? (
                // Discover now card
                <div className="flex flex-col h-full p-6">
                  {/* Image for sm and md screens */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="block lg:hidden relative h-48 md:h-64 mb-6"
                  >
                    <Image
                      src={card.image}
                      alt="Teacher Resources"
                      fill
                      className="object-contain"
                    />
                  </motion.div>

                  <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* Text Content */}
                  <div className="flex flex-col flex-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6"
                    >
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                          className="text-2xl font-bold text-black mb-4 text-center lg:text-left"
                      >
                        {card.title}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                          className="text-gray-600 text-sm font-medium leading-relaxed text-center lg:text-left"
                      >
                        {card.description}
                      </motion.p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                        className="mt-auto flex justify-center lg:justify-start"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                          className="bg-[#E3E6EB] text-black font-bold py-2.5 px-6 rounded-lg transition-all text-[15px] hover:bg-opacity-90 hover:shadow-md w-full lg:w-fit"
                      >
                        {card.buttonText}
                      </motion.button>
                    </motion.div>
                  </div>

                    {/* Image for lg screens */}
                    {/* <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className=""
                    > */}
                    <Image
                      src={card.image}
                      alt="Teacher Resources"
                      // fill
                      className="object-contain hidden lg:block h-full lg:w-[45%]  relative"
                    />
                    {/* </motion.div> */}
                  </div>
                </div>
              ) : (
                // Inbox card
                <div className="flex flex-col h-full p-6">
                  {/* Image for sm and md screens */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="block lg:hidden relative h-48 md:h-64 mb-6"
                  >
                    <Image
                      src={card.image}
                      alt="Teacher Resources"
                      fill
                      className="object-contain"
                    />
                  </motion.div>

                  <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* Text Content */}
                    <div className="flex flex-col flex-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                      >
                        <motion.h2
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-2xl font-bold text-black mb-4 text-center lg:text-left"
                        >
                          {card.title}
                        </motion.h2>
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-gray-600 text-[15px] font-medium leading-relaxed text-center lg:text-left"
                        >
                          {card.description}
                        </motion.p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-auto flex justify-center lg:justify-start"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-[#E3E6EB] text-black font-bold py-2.5 px-6 rounded-lg transition-all text-[15px] hover:bg-opacity-90 hover:shadow-md w-full lg:w-fit"
                        >
                          {card.buttonText}
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Image for lg screens */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="hidden lg:block lg:w-[45%] relative"
                    >
                      <Image
                        src={card.image}
                        alt="Teacher Resources"
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Discover
