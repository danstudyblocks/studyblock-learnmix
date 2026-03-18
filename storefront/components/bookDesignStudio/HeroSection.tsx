"use client"
// Import Swiper styles
import "swiper/css"
import Image from "next/image"
import { useState, useEffect } from "react"
import Skeleton from "../ui/Skeleton"
import { motion } from "framer-motion"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import quoteImg from "@/public/svg/quote-img.svg"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isWithinInterval } from 'date-fns'

// Card data array
const heroCards = [
  {
    id: 1,
    title: "Bespoke exercise books",
    description:
      "Save time, maintain consistency and increase the value of your feedback with a bespoke book design.",
    description1:
      " We are experts in learning design, work with our team of designers to create the perfect exercise book for your students.",
    image: quoteImg,
    buttonText: "Get a quote",
    type: "large",
  },
  {
    id: 2,

    description:
      "Book a call with one of our designers today, and we will talk you through the full process and provide you with free expert advice and a no-obligation quote. ",

    type: "small",
  },
]

function HeroSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [data] = useState(heroCards)
  const [currentDate, setCurrentDate] = useState(new Date(2022, 7, 1)) // August 2022
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date(2022, 7, 10))
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

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
      className={`bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden ${
        type === "large"
          ? "col-span-12 lg:col-span-8 h-[24em] md:h-[28em] lg:h-full"
          : "col-span-12 lg:col-span-4 h-[24em] md:h-[28em] lg:h-full"
      }`}
    >
      <div className="p-6 h-full">
        {type === "large" ? (
          <div className="flex flex-col h-full">
            {/* Mobile Image Skeleton */}
            <div className="block lg:hidden mb-6">
              <Skeleton className="h-48 md:h-64 w-full rounded-lg" />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full">
              <div className="flex flex-col flex-1">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-24 w-full mb-6" />
                <Skeleton className="h-12 w-32 mt-auto" />
              </div>
              {/* Desktop Image Skeleton */}
              <div className="hidden lg:block lg:w-1/2">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            </div>
          </div>
        ) : (
          // Calendar Card Skeleton
          <div className="flex flex-col h-full">
            <Skeleton className="h-24 w-full mb-6" />
            <div className="mt-auto">
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const handleDateClick = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date)
      setSelectedEndDate(null)
    } else {
      if (date < selectedStartDate) {
        setSelectedStartDate(date)
        setSelectedEndDate(selectedStartDate)
      } else {
        setSelectedEndDate(date)
      }
    }
  }

  if (isLoading) {
    return (
      <section className="relative bg-white py-10 mt-[5em]">
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
      className="relative bg-white py-10 mt-[5em]"
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
              className={`bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 ${
                card.type === "large"
                  ? "col-span-12 lg:col-span-8 h-fit md:h-fit lg:h-full"
                  : "col-span-12 lg:col-span-4 h-fit md:h-fit lg:h-full"
              }`}
            >
              {card?.id === 1 ? (
                // Discover now card
                <div className="flex flex-col h-full p-6">
                  {/* Mobile/Tablet Image */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="block lg:hidden mb-6 "
                  >
                    <Image
                      src={card.image}
                      alt="Teacher Resources"
                      className="w-full h-auto md:h-[20em] object-contain rounded-lg"
                    />
                  </motion.div>

                  <div className="flex flex-col lg:flex-row gap-6 h-full">
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
                          <br />
                          <br />
                          {card.description1}
                        </motion.p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-auto"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-[#E3E6EB] text-black font-bold py-2.5 px-6 rounded-lg transition-all text-[15px] hover:bg-opacity-90 hover:shadow-md"
                        >
                          {card.buttonText}
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Desktop Image */}
                    <Image
                      src={card.image}
                      alt="Teacher Resources"
                      className="hidden lg:block w-[50%] h-[20em] object-contain"
                    />
                  </div>
                </div>
              ) : (
                // Calendar card
                <div className="flex flex-col h-full p-6">
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-[#0765FF] font-medium text-[14px] mb-6"
                  >
                    {card.description}
                  </motion.p>

                  {/* Calendar Display */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-auto bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={prevMonth}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <h3 className="font-bold text-lg">
                        {format(currentDate, 'MMMM yyyy')}
                      </h3>
                      <button 
                        onClick={nextMonth}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-600"
                        >
                          {day}
                        </div>
                      ))}
                      {/* Add empty cells for days before the first of the month */}
                      {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                        <div key={`empty-${index}`} className="text-center py-1 text-sm" />
                      ))}
                      {/* Calendar days */}
                      {days.map((day) => {
                        const isSelected = isSameDay(day, selectedStartDate!) || 
                          (selectedEndDate && isSameDay(day, selectedEndDate))
                        const isInRange = selectedStartDate && selectedEndDate && 
                          isWithinInterval(day, { 
                            start: selectedStartDate, 
                            end: selectedEndDate 
                          })

                        return (
                          <div
                            key={day.toISOString()}
                            className={`text-center py-1 px-2 w-fit text-sm cursor-pointer ${
                              isSelected
                                ? "bg-blue-500 text-white rounded-full shadow-md"
                                : isInRange
                                ? "bg-gray-200 shadow-md text-black rounded-full"
                                : "hover:bg-blue-200 hover:text-white rounded-full hover:shadow-md"
                            }`}
                            onClick={() => handleDateClick(day)}
                          >
                            {format(day, 'd')}
                          </div>
                        )
                      })}
                    </div>
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
