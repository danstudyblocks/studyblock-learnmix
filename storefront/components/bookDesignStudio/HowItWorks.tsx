"use client"

import "swiper/css"

import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import FeaturesCards from "./FeaturesCards"

function HowItWorks() {
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
    <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6 flex flex-col items-center h-full">
      <Skeleton className="w-20 h-20 rounded-full mb-4" />
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-10 w-36" />
    </div>
  )

  const SellMoreSkeleton = () => (
    <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6 h-full">
      <Skeleton className="w-12 h-12 mb-4 mx-auto" />
      <Skeleton className="h-8 w-48 mb-3 mx-auto" />
      <Skeleton className="h-16 w-full mb-6 mx-auto" />
      <div className="space-y-4 mb-6 mx-auto">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )

  if (isLoading) {
    return (
      <section className="relative bg-white pb-5">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <CreatorSkeleton key={i} />
                ))}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4">
              <SellMoreSkeleton />
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

export default HowItWorks;
