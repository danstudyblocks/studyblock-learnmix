"use client"
// Import Swiper styles
import "swiper/css"
import Image from "next/image"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import teamAccountImg from "@/public/svg/team-account-img.svg"
import trustedSchoolImg from "@/public/svg/trusted-school-img.svg"

// Card data array
const heroCards = [
  {
    id: 1,
    title: "Sharing the workload with team accounts",
    description: [
      {
        subtitle: "AI-powered tools",
        text: "Use our AI tools to create, edit and differentiate content in seconds. With a range of teacher created prompts designed to help you create worksheets, quizzes, keyword lists, flashcards and more with ease.",
      },
      {
        subtitle: "Your resources your style",
        text: "Set up school and department brand kits and templates for your team to design with. Include school colours, logos and fonts with ease.",
      },
      {
        subtitle: "Create, store, share",
        text: "Easily control individual permissions, save and manage your designs and share your work with your team, school or the studyblocks community with the touch of a button.",
      },
    ],
    image: teamAccountImg,
    buttonText: "Join the waiting list",
  },
  {
    id: 2,
    title: "Sell your resources with StudyBlocks",
    description: [
      {
        subtitle: "Save time with StudyBlocks",
        text: "Our marketplace is fully managed by the StudyBlocks team, sit back and relax while we create beautiful product images and descriptions designed to showcase your designs.",
      },
      {
        subtitle: "Your store, your resources",
        text: "Every StudyBlocks creator has their own store where you can showcase your designs and resources. And with our unique and user friendly dashboard uploading resources, tracking sales and requesting payouts has never been easier.",
      },
      {
        subtitle: "Industry leading commission",
        text: "Be rewarded for your knowledge and hard work with 70% commission on every sale. We don't charge a 20p transaction fee like other resource marketplaces, so you keep more of your money on every sale!",
      },
      {
        subtitle: "Print on demand",
        text: "Sell your designs as professionally printed products with ease with our exclusive print-on-demand service. It's a great way to increase your sales and we manage all the shipping and fulfillment.",
      },
    ],
    buttonText: "Start designing",
    buttonText1: "Update a resource",
  },
]

function SellResource() {
  const [isLoading, setIsLoading] = useState(true)
  // const [data, setData] = useState(heroCards)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const CardSkeleton = ({ hasImage = false }) => (
    <div className="bg-white rounded-[16px] border-2 border-gray-200 p-4 sm:p-6 md:p-8 flex flex-col h-full">
      {/* Title Skeleton */}
      <Skeleton className="h-8 sm:h-10 w-3/4 mb-4 sm:mb-6" />

      {/* Image Skeleton - Only for first card */}
      {hasImage && (
        <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] mb-4 sm:mb-6">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      )}

      {/* Features List Skeleton */}
      <div className="space-y-4 sm:space-y-6 flex-grow">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="space-y-2">
            <Skeleton className="h-5 sm:h-6 w-48" />
            <Skeleton className="h-12 sm:h-16 w-full" />
          </div>
        ))}
      </div>

      {/* Buttons Skeleton */}
      <div className="mt-6 sm:mt-8 space-y-3">
        <Skeleton className="h-10 sm:h-12 w-full" />
        {!hasImage && <Skeleton className="h-10 sm:h-12 w-full" />}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white py-5">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSkeleton hasImage={true} />
            <CardSkeleton hasImage={false} />
          </div>

          {/* Trusted School Skeleton */}
          <div className="flex flex-col items-center justify-center mt-8 sm:mt-10">
            {/* Heading Skeleton */}
            <div className="mb-4 sm:mb-6 px-4">
              <Skeleton className="h-8 sm:h-10 w-[300px] sm:w-[400px]" />
            </div>

            {/* Image Skeleton */}
            <div className="w-full max-w-[800px]">
              <Skeleton className="h-[100px] sm:h-[120px] md:h-[150px] w-full" />
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
      className="relative bg-white py-6 sm:py-8 md:py-5"
    >
      <div className="container px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-[22px] sm:gap-6"
        >
          {/* First Card - Team Accounts */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-[16px] border-2 border-gray-200 p-4 sm:p-6 md:p-8 flex flex-col h-full"
          >
            <motion.h2
              variants={itemVariants}
              className="text-[#0765FF] text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
            >
              {heroCards[0].title}
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] mb-4 sm:mb-6"
            >
              <Image
                src={heroCards[0].image}
                alt="Team Accounts"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </motion.div>

            {/* Features List */}
            <div className="space-y-4 sm:space-y-6 flex-grow">
              {heroCards[0].description.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <h3 className="font-bold text-lg sm:text-xl mb-2">
                    {item.subtitle}
                  </h3>
                  <p className="text-black font-medium leading-relaxed text-sm sm:text-base">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="mt-6 sm:mt-8">
              <button className="w-full bg-[#E3E6EB] text-black font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-opacity-90 hover:shadow-md transition-all text-sm sm:text-base">
                {heroCards[0].buttonText}
              </button>
            </motion.div>
          </motion.div>

          {/* Second Card - Sell Resources */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-[16px] border-2 border-gray-200 p-4 sm:p-6 md:p-8 flex flex-col h-full"
          >
            <motion.h2
              variants={itemVariants}
              className="text-[#0765FF] text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
            >
              {heroCards[1].title}
            </motion.h2>

            {/* Features List */}
            <div className="space-y-4 sm:space-y-6 flex-grow">
              {heroCards[1].description.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <h3 className="font-bold text-lg sm:text-xl mb-2">
                    {item.subtitle}
                  </h3>
                  <p className="text-black font-medium leading-relaxed text-sm sm:text-base">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 mt-6 sm:mt-8"
            >
              <button className="w-full bg-[#E3E6EB] text-black font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-opacity-90 hover:shadow-md transition-all text-sm sm:text-base">
                {heroCards[1].buttonText}
              </button>
              <button className="w-full bg-[#E3E6EB] text-black font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-opacity-90 hover:shadow-md transition-all text-sm sm:text-base">
                {heroCards[1].buttonText1}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Trusted School */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center mt-8 sm:mt-10"
        >
          <h2 className="text-xl sm:text-lg md:text-3xl font-bold mb-4 sm:mb-6 text-center px-4">
            Trusted by teachers and schools worldwide
          </h2>
          <div className="w-full max-w-[800px] relative">
            <Image
              src={trustedSchoolImg}
              alt="Trusted School"
              className="w-full h-auto"
              priority
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default SellResource
