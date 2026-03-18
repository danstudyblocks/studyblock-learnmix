import Image from "next/image"
import { motion } from "framer-motion"
import customMailIcon from "@/public/svg/custom-mail-icon-1.svg"
import Skeleton from "../ui/Skeleton"

import coversImg from "@/public/svg/covers-img.svg"
import innerPageIcon from "@/public/svg/inner-page-icon.svg"
import studyBlockImg from "@/public/svg/study-block-img.svg"
import standardIcon from "@/public/svg/standard-icon.svg"
import earthIcon from "@/public/svg/earth-icon.svg"
import knowledgeImg from "@/public/svg/knowledge-img.svg"

// Creator card data
const creatorCards = [
  {
    id: 1,
    title: "Front Covers",
    description: "Include information such as: input boxes, school logos and mottos.",
    image: coversImg,
  },
  {
    id: 2,
    title: "Knowledge organisers",
    description: "Add a range of additional pages such as literacy tips, school rules etc.",
    image: knowledgeImg,
  },
  {
    id: 3,
    title: "Inner pages",
    description: "Choose from lines, plain, grid, isometric, or even a combination.",
    image: innerPageIcon,
  },
  {
    id: 4,
    title: "Include StudyBlocks resources in your book for free!",
    description: "Select from a library of thousands of resources",
    image: studyBlockImg,
  },
  {
    id: 5,
    title: "Premium quality, as standard",
    description: "All of our books are printed in the U.K with 120gsm quality paper and 350gsm covers for extra toughness.",
    image: standardIcon,
  },
  {
    id: 6,
    title: "Carbon-balanced from print to delivery",
    description: "All of our books are printed in the U.K with 120gsm quality paper and 350gsm covers for extra toughness.",
    image: earthIcon,
  },
]

const sellMoreCard = {
  title: "Request a sample",
  description: "Order a sample exercise book today!",
  buttonText: "Shop",
  icon: customMailIcon,
}

const CreatorSkeleton = () => (
  <div className="bg-white rounded-lg border-2 border-gray-200 p-6 h-full">
    <div className="flex flex-col h-full">
      <Skeleton className="w-24 h-24 mb-6" />
      <Skeleton className="h-7 w-48 mb-3" />
      <Skeleton className="h-20 w-full" />
    </div>
  </div>
)

function FeaturesCards() {
  return (
    <div className="container">
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Left side - Creator cards */}
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-[16px] border-2 border-gray-200 p-6 hover:shadow-md transition-all h-full flex flex-col"
              >
                <div className="flex flex-col h-full items-center justify-center">
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="w-24 h-24 object-contain mb-6"
                  />
                  <h3 className="text-lg text-center font-bold mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-center font-medium text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Sample Request card */}
        <motion.div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-[16px] border-2 border-gray-200 p-8 flex flex-col items-center h-full">
            <div className="flex-1" />
            <Image
              src={sellMoreCard.icon}
              alt={sellMoreCard.title}
              className="w-40 h-40 object-contain mb-8"
            />
            <h2 className="text-3xl font-bold text-center mb-4">
              {sellMoreCard.title}
            </h2>
            <p className="text-gray-600 font-medium text-center text-lg mb-8">
              {sellMoreCard.description}
            </p>
            <button className="w-fit bg-[#0765FF] text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 hover:shadow-md transition-all text-lg">
              {sellMoreCard.buttonText}
            </button>
            <div className="flex-1" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FeaturesCards
