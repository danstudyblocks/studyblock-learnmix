"use client"

import "swiper/css"
import desingeEditorImg from "@/public/svg/design-editor-img.svg"
import Image from "next/image"
import joinTodayImg from "@/public/svg/join-today-img.svg"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"

// Card data array
const heroCards = [
  {
    id: 1,
    title: "Designer Editor",
    description:
      "A growing library of free and premium teaching and learning resource templates and assets. Designed to help you create bespoke, professional resources in minutes not hours.",
    image: desingeEditorImg,
    buttonText: "Start designing",
    type: "large",
  },
  {
    id: 2,
    title: "Over 7 million design assets to get you started",
    description:
      "Use our design assets to create high quality learning resources in minutes!",
    userImage: joinTodayImg,
    buttonText: "Join today",
    type: "small",
  },
]

function Hero() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(heroCards)

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
    <div
      className={`bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden ${
        type === "large"
          ? "col-span-12 lg:col-span-9 h-[24em] md:h-[28em] lg:h-[21em]"
          : "col-span-12 lg:col-span-3 h-[24em] md:h-[28em] lg:h-[21em]"
      }`}
    >
      <div className="p-6 h-full">
        {type === "large" ? (
          <div className="flex flex-col h-full">
            {/* Image skeleton for sm/md */}
            <div className="lg:hidden">
              <Skeleton className="h-48 md:h-64 w-full mb-6 rounded-lg" />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full">
              <div className="flex flex-col flex-1">
                <div className="mb-6">
                  <Skeleton className="h-8 w-3/4 mb-4 mx-auto lg:mx-0" />
                  <Skeleton className="h-24 w-full mb-6" />
                </div>
                <div className="mt-auto flex justify-center lg:justify-start">
                  <Skeleton className="h-10 w-full sm:w-full lg:w-32" />
                </div>
              </div>

              {/* Image skeleton for lg */}
              <div className="hidden lg:block lg:w-[60%]">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            </div>
          </div>
        ) : (
          // Small card skeleton
          <div className="flex flex-col items-center h-full">
            <Skeleton className="w-[120px] h-[80px] mb-6" />
            <Skeleton className="h-14 w-[80%] mb-4" />
            <Skeleton className="h-12 w-[90%] mb-6" />
            <Skeleton className="h-10 w-full mt-auto" />
          </div>
        )}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white py-10 mt-[3em] md:mt-[3em] lg:mt-[5em]">
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
      className="relative bg-white py-10 mt-[3em] md:mt-[3em] lg:mt-[5em]"
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
                  ? "col-span-12 lg:col-span-9 h-fit md:h-fit lg:h-[21em]"
                  : "col-span-12 lg:col-span-3 h-fit md:h-fit lg:h-[21em]"
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
                    className="relative h-48 md:h-64 lg:h-[1em] lg:hidden mb-6"
                  >
                    <Image
                      src={card.image}
                      alt="Teacher Resources"
                      fill
                      className="object-contain"
                    />
                  </motion.div>

                  <div className="flex flex-col lg:flex-row gap-6 h-full justify-between">
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
                          className="text-gray-600 text-[15px] leading-relaxed font-medium text-center lg:text-left"
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
                          className="bg-[#E3E6EB] text-black font-bold py-2.5 px-6 rounded-lg transition-all text-[15px] hover:bg-opacity-90 hover:shadow-md sm:w-full lg:w-fit"
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
                        className="object-contain relative h-full lg:w-[50%] hidden lg:block"
                      />
                    {/* </motion.div> */}
                  </div>
                </div>
              ) : (
                // Inbox card
                <div className="flex flex-col items-center justify-between h-full p-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center w-full"
                  >
                      <Image
                        src={card.userImage}
                        alt={card.title}
                        className="w-[60%] h-[60%] sm:w-[40%] sm:h-[40%] md:w-[40%] md:h-[40%] lg:w-[80%] lg:h-[80%] object-contain"
                      />
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl font-bold text-black mb-2 text-center"
                    >
                      {card.title}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-sm font-medium text-center mb-6"
                    >
                      {card.description}
                    </motion.p>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-[#E3E6EB] text-black font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-opacity-90 hover:shadow-md mt-auto"
                  >
                    {card.buttonText}
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Hero
