"use client"

import "swiper/css"
import discoverNowImg from "@/public/svg/discover-now-img.svg"
import mailIcon from "@/public/svg/custom-mail-icon.svg"
import Image from "next/image"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import { FiPlus } from "react-icons/fi"
import Link from "next/link"

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
    link: "/book-design-studio"
  },
  {
    id: 2,
    title: "Inbox",
    description:
      "Become part of our community to enjoy exclusive discounts, news and downloads.",
    userImage: mailIcon,
    buttonText: "Email",
    buttonText1: "Join",
    type: "small",
    link: "/book-design-studio"
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
      className={`bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden ${type === "large"
          ? "col-span-12 lg:col-span-8 h-[24em] md:h-[28em] lg:h-[20em]"
          : "col-span-12 lg:col-span-4 h-[24em] md:h-[28em] lg:h-[20em]"
        }`}
    >
      <div className="p-6 h-full flex flex-col">
        {type === "small" ? (
          <>
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 mb-6 mx-auto" />
            <Skeleton className="h-8 w-32 mb-4 mx-auto" />
            <Skeleton className="h-20 w-full mb-6" />
            <div className="flex gap-4 mt-auto">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-24" />
            </div>
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            <div className="flex flex-col flex-1">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-24 w-full mb-6" />
              <Skeleton className="h-12 w-32 mt-auto" />
            </div>
            <Skeleton className="h-48 md:h-64 lg:h-full w-full lg:w-1/2 rounded-lg" />
          </div>
        )}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white py-5">
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
      className="relative bg-white py-5"
    >
      <div className="container">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-12 gap-[22px]"
        >
          {data.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 ${card.type === "large"
                  ? "col-span-12 lg:col-span-8 h-fit md:h-fit lg:h-[21em]"
                  : "col-span-12 lg:col-span-4 h-fit md:h-fit lg:h-[21em]"
                }`}
            >
              {card?.id === 1 ? (
                // Discover now card
                <div className="flex flex-col lg:flex-row h-full p-6 gap-6">
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
                        className="text-2xl font-bold text-black mb-4"
                      >
                        {card.title}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-600 text-[15px] leading-relaxed font-medium"
                      >
                        {card.description}
                      </motion.p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mt-auto"
                    >
                      <Link href={card.link}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-[#E3E6EB] text-black font-bold py-2.5 px-6 rounded-lg transition-all text-[15px] hover:bg-opacity-90 hover:shadow-md"
                        >
                          {card.buttonText}
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative h-48 md:h-64 lg:h-auto lg:w-1/2"
                  >
                    <Image
                      src={card.image}
                      alt="Teacher Resources"
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                </div>
              ) : (
                // Inbox card
                <div className="flex flex-col h-full p-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-6"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto">
                      <Image
                        src={card.userImage}
                        alt="Mail Icon"
                        width={96}
                        height={96}
                        className="w-full h-full"
                      />
                    </div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-black"
                    >
                      {card.title}
                    </motion.h2>
                  </motion.div>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-[15px] text-center mb-6 font-medium"
                  >
                    {card.description}
                  </motion.p>

                  <div className="flex gap-2">
                    <motion.input
                      type="email"
                      placeholder="Email"
                      className="h-12 w-full sm:w-[10%] md:w-full px-2 bg-[#E3E6EB] text-black placeholder:text-black rounded-lg border-none text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0765FF]"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-12 bg-[#0765FF] text-white font-bold px-3 rounded-lg transition-all text-[15px] hover:bg-opacity-90 hover:shadow-md flex items-center gap-1"
                    >
                      <FiPlus className="text-lg" /> Join
                    </motion.button>
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
