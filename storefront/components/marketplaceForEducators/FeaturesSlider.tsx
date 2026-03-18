"use client"
import React, { useState } from "react"
import stickersIcon from "@/public/svg/stickers-icon.svg"
import worksheetsIcon from "@/public/svg/worksheets-icon.svg"
import classroomIcon from "@/public/svg/classroom-icon.svg"
import postcardIcon from "@/public/svg/postcard-icon.svg"
import workbooksIcon from "@/public/svg/workbooks-icon.svg"
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
    title: "Postcards",
    icon: postcardIcon,
  },
  {
    id: 5,
    title: "Workbooks",
    icon: workbooksIcon,
  },
]

function FeaturesSlider() {
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const CardSkeleton = () => (
    <div className="flex gap-8">
      {[1, 2, 3, 4].map((item) => (
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
      <section className="py-8 bg-white">
        <div className="container">
          <div className="overflow-hidden">
            <CardSkeleton />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-white">
      <div className="container">
        {/* Sliding animation container */}
        <div className="overflow-hidden relative">
          <motion.div
            className="flex gap-8"
            animate={{
              x: ["0%", "-45%"]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            style={{
              width: "fit-content", // This ensures proper width for animation
              display: "flex",
              gap: "2rem"
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

export default FeaturesSlider;
