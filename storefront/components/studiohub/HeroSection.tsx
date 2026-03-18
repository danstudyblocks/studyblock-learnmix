"use client"

import "swiper/css"
import dummyUserProfile from "@/public/svg/dummy-user-profile.svg"
import dummyDesignerEditorImg from "@/public/svg/dummy-designer-editor-img.svg"
import designForTeachers from "@/public/svg/design-for-teachers.svg"
import Image from "next/image"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import Link from "next/link"

// Card data array
const heroCards = [
  {
    id: 1,
    title: "Hi, username",
    description:
      "This is your personal homepage showing you exclusive new resources for subjects and areas you're interested in...",
    userImage: dummyUserProfile,
    userName: "David",
    type: "small",
    link: "/"
  },
  {
    id: 2,
    title: "Design Editor",
    description:
      "Edit our templates or create your own professional learning resources to share, sell and print.",
    image: dummyDesignerEditorImg,
    buttonText: "Start designing",
    type: "small",
    link: "design-editor"
  },
  {
    id: 3,
    title: "Free design for teachers",
    description:
      "For a limited time, educators worldwide can access our free graphic design service. Upload your resource and get it enhanced with professional design and AI,",
    image: designForTeachers,
    buttonText: "Upload a resource",
    type: "large",
    highlight: "free of charge!",
    link: "/dashboard/upload-a-resource"
  },
]

function HeroSection({ customer }: any) {
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
        ? "col-span-12 md:col-span-12 lg:col-span-6 h-[28em]"
        : "col-span-12 md:col-span-6 lg:col-span-3 h-[28em]"
        }`}
    >
      <div className="p-6 h-full flex flex-col">
        {type === "small" ? (
          <>
            <Skeleton className="w-12 h-12 rounded-full mb-4 mx-auto" />
            <Skeleton className="h-8 w-3/4 mb-4 mx-auto" />
            <Skeleton className="h-20 w-full mb-4" />
          </>
        ) : (
          <>
            <Skeleton className="h-48 w-full mb-6 rounded-lg" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full mb-6" />
            <Skeleton className="h-10 w-32" />
          </>
        )}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white pt-25 md:pt-32">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <CardSkeleton type="small" />
            <CardSkeleton type="small" />
            <CardSkeleton type="large" />
          </div>
          <div className="mt-5 flex justify-between">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-24" />
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
      className="relative bg-white pt-25 md:pt-32 pb-5"
    >
      <div className="container">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-12 gap-[22px] w-full"
        >
          {data.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 ${card.type === "large"
                ? "col-span-12 md:col-span-12 lg:col-span-6 h-[28em]"
                : "col-span-12 md:col-span-6 lg:col-span-3 h-[28em]"
                }`}
            >
              {card?.id === 1 ? (
                // Profile card
                <div className="flex flex-col h-full p-6">
                  {/* Profile Header */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                  >
                    {card.userImage ? (
                      <Image
                        src={card?.userImage}
                        alt="Profile"
                        className="rounded-full mb-[1em] mx-auto"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
                        {card.userName?.[0].toUpperCase()}
                      </div>
                    )}
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-black"
                    >
                      {customer?.first_name ? `Hi, ${customer.first_name}` : card.title}
                    </motion.h2>
                  </motion.div>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-[16px] font-medium mb-4"
                  >
                    {card?.description}
                  </motion.p>
                </div>
              ) : card?.id === 2 ? (
                // Design Editor card with animations
                <div className="flex flex-col h-full p-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className=""
                  >
                    {card?.image ? (
                      <Image
                        src={card?.image}
                        alt="Profile"
                        className="rounded-full mb-[1em] mx-auto"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
                        {card?.title?.[0].toUpperCase()}
                      </div>
                    )}
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl font-bold text-black mb-1"
                    >
                      {card.title}
                    </motion.h2>
                  </motion.div>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-[16px] font-medium mb-1"
                  >
                    {card?.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-auto"
                  >
                    <Link href={card.link}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-lg transition-colors text-[16px] hover:opacity-80 hover:shadow-md"
                      >
                        {card?.buttonText}
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>
              ) : (
                // Free design card with animations
                <div className="flex flex-col h-full p-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 relative overflow-hidden rounded-lg mb-6"
                  >
                    <Image
                      src={card.image}
                      alt="Teacher Resources"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

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
                      className="text-2xl font-bold text-black mb-2"
                    >
                      {card.title}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-gray-600 text-[16px] font-medium"
                    >
                      {card.description}{" "}
                      <span className="text-blue-500 text-[16px] font-semibold">
                        {card.highlight}
                      </span>
                    </motion.p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Link href={"/dashboard/upload-a-resource"}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-fit bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-lg transition-colors text-[16px] hover:opacity-80 hover:shadow-md"
                      >
                        {card.buttonText}
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default HeroSection
