"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaCheck } from "react-icons/fa"
import teacherSchoolPlansImg from "@/public/svg/teacher-school-plans-img.svg"
import { FaRegStar } from "react-icons/fa"
import Image from "next/image"
import Skeleton from "@/components/ui/Skeleton"
import trustedSchoolImg from "@/public/svg/trusted-school-img.svg"

const plans = [
  {
    id: 1,
    title: "Planners + Notebooks",
    price: "£1.00",
    period: "per book",
    description:
      "Design the perfect termly planner with a StudyBlocks designer.",
    features: [
      "Free professional design",
      "Include your school branding",
      "Include resources from StudyBlocks for free",
      "A5 & A4 sizes available",
      "Premium 120gsm writing paper",
      "Square folded for extra strength",
      "350gsm full colour covers",
      "Fully carbon-balanced from print to delivery",
      "Minimum order of 100 books",
      "The opportunity to sell your design to the StudyBlocks community",
    ],
    buttonText: "Request a quote | Book a chat",
    tag: "New",
  },
  {
    id: 2,
    title: "Exercise books",
    price: "90p",
    period: "per book",
    description:
      "Create subject specific exercise books with ease with the StudyBlocks team.",
    features: [
      "Free professional design",
      "Include your school branding",
      "Include resources from StudyBlocks for free",
      "A5 & A4 sizes available",
      "Premium 120gsm writing paper",
      "Square folded for extra strength",
      "350gsm full colour covers",
      "Fully carbon-balanced from print to delivery",
      "Minimum order of 100 | Bulk discounts available",
      "The opportunity to sell your design to the StudyBlocks community",
    ],
    buttonText: "Request a quote | Book a chat",
    tag: "Most popular",
  },
  {
    id: 3,
    title: "CPD journals",
    price: "£2.59",
    period: "per journal",
    description:
      "Track CPD with our super popular journals, designed to suit your teams needs.",
    features: [
      "Free professional design",
      "Include your school branding",
      "Include resources from StudyBlocks for free",
      "A4 size",
      "Premium 120gsm writing paper",
      "Square folded for extra strength",
      "350gsm full colour covers",
      "Fully carbon-balanced from print to delivery",
      "Minimum order of 50",
      "The opportunity to sell your design to the StudyBlocks community",
    ],
    buttonText: "Request a quote | Book a chat",
    tag: "For Teachers",
  },
]

const PlanSkeleton = () => (
  <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6 flex flex-col min-h-[750px]">
    {/* Title and Tag Container */}
    <div className="flex items-start justify-between mb-4">
      {/* Title and Icon Skeleton */}
      <div className="flex items-start gap-2">
        <Skeleton className="w-6 h-6 rounded flex-shrink-0" />
        <div>
          <Skeleton className="h-5 w-20 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Tag Skeleton */}
      <Skeleton className="h-6 w-24 flex-shrink-0" />
    </div>

    {/* Price Skeleton - Fixed Height */}
    <div className="h-[48px] mb-6">
      <Skeleton className="h-12 w-32" />
    </div>

    {/* Description Skeleton - Fixed Height */}
    <div className="h-[80px] mb-6">
      <Skeleton className="h-full w-full" />
    </div>

    {/* Button Skeleton - Fixed Height */}
    <div className="h-[48px] mb-6">
      <Skeleton className="h-full w-full" />
    </div>

    {/* Features Skeleton - Remaining Height */}
    <div className="space-y-4 flex-grow">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex items-start gap-3">
          <Skeleton className="w-4 h-4 flex-shrink-0 mt-1" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
)

const TrustedSchoolSkeleton = () => (
  <div className="flex flex-col items-center justify-center mt-8 sm:mt-10">
    {/* Title Skeleton */}
    <div className="mb-4 sm:mb-6 px-4">
      <Skeleton className="h-8 sm:h-10 w-[300px] sm:w-[400px]" />
    </div>

    {/* Image Skeleton */}
    <div className="w-full max-w-[800px]">
      <Skeleton className="h-[100px] sm:h-[120px] md:h-[150px] w-full rounded-lg" />
    </div>
  </div>
)

function QuoteBookPlans() {
  const [isLoading, setIsLoading] = useState(true)

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="py-4 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <PlanSkeleton key={item} />
            ))}
          </div>

          <TrustedSchoolSkeleton />
        </div>
      </section>
    )
  }

  return (
    <section className="py-4 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-[22px]">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-[16px] border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-300 flex flex-col min-h-[750px]"
            >
              {/* Plan Title and Info and Plan Tag*/}
              <div className="flex items-start justify-between mb-4">
                {/* Title and Info - Left Side */}
                <div className="flex items-start gap-2">
                  <Image
                    src={teacherSchoolPlansImg}
                    alt={plan.title}
                    className="w-6 h-6 object-contain flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold mb-0.5">{plan.title}</h3>
                  </div>
                </div>

                {/* Plan Tag - Right Side */}
                <div className="flex-shrink-0 ml-2">
                  {plan.tag && (
                    <div className="flex items-center gap-1 text-xs bg-[#E3E6EB] rounded-md px-2 py-1 text-black whitespace-nowrap">
                      {plan.tag} <FaRegStar className="text-black text-xs " />
                    </div>
                  )}
                </div>
              </div>

              {/* Price - Fixed Height */}
              <div className="h-[48px] mb-6 flex items-baseline gap-1 border-b border-gray-200">
                <span className="text-black font-medium">From</span>{" "}
                <span className="text-4xl font-bold text-[#0765FF]">
                  {plan.price}{" "}
                </span>
                <span className="text-black font-medium">
                  {plan.id === 3 ? "per journal" : "per book"}
                </span>
              </div>

              {/* Description - Fixed Height */}
              <div className="h-[80px] mb-6">
                <p className="text-black text-[15px] font-medium">
                  {plan.description}
                </p>
              </div>

              {/* CTA Button - Fixed Height */}
              <div className="h-[48px] mb-6">
                <button
                  className={`w-full h-full rounded-lg ${
                    plan.id === 2
                      ? "bg-[#E3E6EB] mt-3 md:mt-0 hover:bg-opacity-90 text-black hover:shadow-md "
                      : "bg-[#E3E6EB] hover:bg-opacity-90 text-black hover:shadow-md"
                  } transition-colors font-medium`}
                >
                  {plan.buttonText}
                </button>
              </div>

              {/* Features - Remaining Height */}
              <div className="space-y-4 flex-grow">
                {plan?.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheck className="text-black mt-1 flex-shrink-0 text-sm" />
                    <span
                      className={` ${
                        index === plan.features.length - 1 // Check if it's the last index
                          ? plan.features.length
                            ? "text-[#0765FF]"
                            : "text-black"
                          : ""
                      }  font-medium`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

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
    </section>
  )
}

export default QuoteBookPlans
