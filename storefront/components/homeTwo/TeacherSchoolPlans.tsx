"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaCheck } from "react-icons/fa"
import teacherSchoolPlansImg from "@/public/svg/teacher-school-plans-img.svg"
import { FaRegStar } from "react-icons/fa"
import Image from "next/image"
import Skeleton from "@/components/ui/Skeleton"

const plans = [
  {
    id: 1,
    title: "Starter",
    price: "Free",
    period: "",
    description:
      "For designing and editing resources quickly with a range of free templates and assets.",
    features: [
      "Access to free design templates & assets",
      "Edit your StudyBlocks downloads",
      "Export print ready jpg's",
      "Share and sell your designs on StudyBlocks",
      "Free limited monthly AI credits",
      "StudyBlocks print on demand service",
    ],
    buttonText: "Start designing",
    tag: "",
  },
  {
    id: 2,
    title: "Pro",
    price: "£6.99",
    period: "/monthly",
    description:
      "Ideal for teachers who want to take their learning resources to the next level with a range of premium assets, templates and features.",
    features: [
      "Everything in Starter +",
      "Access to premium templates and asssets",
      "Import from a library of over 7 million icons",
      "Save your designs to your personal library",
      "Export a range of file types (pdf,svg,jpg)",
      "Unlimited AI credits",
      "Exclusive support from StudyBlocks designers",
    ],
    buttonText: "Start your free 7 days trial",
    tag: "Most Popular",
  },
  {
    id: 3,
    title: "Team/School",
    price: "£99.00",
    period: "/monthly",
    description:
      "For department and school teams to create together with premium workplace tools, storage and sharing features.",
    features: [
      "Everything in Pro +",
      "Exclusive onboarding and support services",
      "Restrict levels of content editing by user",
      "Team and school access to all resources",
      "Store your own assets such as school logos, photos and resources securely.",
      "Exclusive discounts on printing",
    ],
    buttonText: "Join the waiting list",
    tag: "Coming Soon",
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

function TeacherSchoolPlans() {
  const [isLoading, setIsLoading] = useState(true)

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
          <Skeleton className="h-12 w-96 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-[22px]">
            {[1, 2, 3].map((item) => (
              <PlanSkeleton key={item} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          A perfect fit for every teacher and school
        </h2>

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
                    <p className="text-xs text-gray-600">
                      Pause or cancel anytime
                    </p>
                  </div>
                </div>
                
                {/* Plan Tag - Right Side */}
                <div className="flex-shrink-0 ml-2">
                  {plan.tag && (
                    <div className="flex items-center gap-1 text-xs bg-[#E3E6EB] rounded-md px-2 py-1 text-black whitespace-nowrap">
                      {plan.tag} <FaRegStar className="text-black text-xs" />
                    </div>
                  )}
                </div>
              </div>

              {/* Price - Fixed Height */}
              <div className="h-[48px] mb-6 flex items-baseline gap-1 border-b border-gray-200">
              <span className="text-black font-medium">{plan.id === 3? ("From"):("")}</span>{" "}
                <span className="text-4xl font-bold text-[#0765FF]">
                  {plan.price}
                </span>
                <span className="text-black font-medium">{plan.period}</span>
              </div>

              {/* Description - Fixed Height */}
              <div className="h-[80px] mb-6">
                <p className="text-black text-[15px] font-medium">{plan.description}</p>
              </div>

              {/* CTA Button - Fixed Height */}
              <div className="h-[48px] mb-6">
                <button
                  className={`w-full h-full rounded-lg ${
                    plan.id === 2
                      ? "bg-[#0765FF] mt-3 md:mt-0 hover:bg-opacity-90 text-white hover:shadow-md"
                      : "bg-[#E3E6EB] hover:bg-opacity-90 text-black hover:shadow-md"
                  } transition-colors font-medium`}
                >
                  {plan.buttonText}
                </button>
              </div>

              {/* Features - Remaining Height */}
              <div className="space-y-4 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheck className="text-black mt-1 flex-shrink-0 text-sm" />
                    <span className="text-black text-[15px] font-medium">{feature}</span>
                  </li>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeacherSchoolPlans
