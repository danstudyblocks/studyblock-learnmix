"use client"
import React, { useState } from "react"
import feedbackIcon from "@/public/svg/feedback-icon.svg"
import stickersIcon from "@/public/svg/stickers-icon.svg"
import worksheetsIcon from "@/public/svg/worksheets-icon.svg"
import classroomIcon from "@/public/svg/classroom-icon.svg"
import presentationIcon from "@/public/svg/presentation-icon.svg"
import postcardIcon from "@/public/svg/postcard-icon.svg"
import workbooksIcon from "@/public/svg/workbooks-icon.svg"
import brandIcon from "@/public/svg/brand-icon.svg"
import Image from "next/image"
import { motion } from "framer-motion"
import Skeleton from "../ui/Skeleton"

// Card data array
const designCards = [
  {
    id: 1,
    title: "Classroom displays",
    icon: classroomIcon,
  },
  {
    id: 2,
    title: "Worksheets",
    icon: worksheetsIcon,
  },
  {
    id: 3,
    title: "Stickers",
    icon: stickersIcon,
  },
  {
    id: 4,
    title: "Feedback sheets",
    icon: feedbackIcon,
  },
  {
    id: 5,
    title: "Presentations",
    icon: presentationIcon,
  },
  {
    id: 6,
    title: "Postcards",
    icon: postcardIcon,
  },
  {
    id: 7,
    title: "Workbooks",
    icon: workbooksIcon,
  },
  {
    id: 8,
    title: "Something brand new!",
    icon: brandIcon,
  },
]

function HowItWorks() {
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const CardSkeleton = () => (
    <div className="flex gap-8">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="flex flex-col items-center justify-center min-w-[160px] p-4 border-2 border-gray-200 rounded-[16px]"
        >
          <Skeleton className="w-16 h-16 rounded-[16px] mb-3" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <section className="bg-white">
        <div className="container">
          <Skeleton className="h-10 w-72 mx-auto mb-12" />
          <div className="overflow-hidden">
            <CardSkeleton />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white">
      <div className="container">
        {/* Main heading */}
        <h2 className="text-2xl md:text-4xl lg:text-4xl font-bold text-center mb-12">
          What will you design today?
        </h2>

        {/* Sliding animation container */}
        <div className="overflow-hidden relative">
          <motion.div
            className="flex gap-8"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {/* First set of cards */}
            {designCards.map((card) => (
              <div
                key={card.id}
                className="flex flex-col items-center justify-center min-w-[160px] p-4 border-2 border-gray-200 rounded-[16px] hover:border-gray-300 transition-all hover:shadow-md cursor-pointer"
              >
                <div className="w-16 h-16 mb-3">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-md text-center font-bold">{card.title}</p>
              </div>
            ))}

            {/* Duplicate set for seamless loop */}
            {designCards.map((card) => (
              <div
                key={`${card.id}-duplicate`}
                className="flex flex-col items-center justify-center min-w-[160px] p-4 border-2 border-gray-200 rounded-[16px] hover:border-gray-300 transition-all hover:shadow-md cursor-pointer"
              >
                <div className="w-16 h-16 mb-3">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-md text-center font-bold">{card.title}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
