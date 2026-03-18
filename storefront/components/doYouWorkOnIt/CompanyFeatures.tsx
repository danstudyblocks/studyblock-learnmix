"use client"

import "swiper/css"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import FeaturesCards from "./FeaturesCards"

function CompanyFeatures() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

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

  const CreatorSkeleton = () => (
    <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6">
      <div className="flex flex-row justify-between items-start gap-2">
        <Skeleton className="w-[2.5em] h-[2.5em] rounded-full flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  )

  const FeatureCardSkeleton = () => (
    <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6 flex flex-col items-center">
      <Skeleton className="w-12 h-12 mb-4" />
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-16 w-full mb-4" />
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  )

  const InboxCardSkeleton = () => (
    <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6 flex flex-col items-center h-full">
      <div className="flex-1" />
      <Skeleton className="w-40 h-40 mb-6" />
      <Skeleton className="h-8 w-32 mb-3" />
      <Skeleton className="h-16 w-64 mb-6" />
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="flex-1" />
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white pb-10">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
                {[1, 2, 3].map((i) => (
                  <CreatorSkeleton key={`testimonial-${i}`} />
                ))}
                {[1, 2, 3].map((i) => (
                  <FeatureCardSkeleton key={`feature-${i}`} />
                ))}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3">
              <InboxCardSkeleton />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-white pb-5">
      <FeaturesCards />
    </section>
  )
}

export default CompanyFeatures
