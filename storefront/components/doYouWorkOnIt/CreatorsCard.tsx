import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import creatorImg from "@/public/svg/dummy-creator-icon.svg"
import sellMoreIcon from "@/public/svg/sell-more-icon.svg"

// Creator card data
const creatorCards = [
  {
    id: 1,
    name: "Go Explore, Make",
    description: "Design and technology resources",
    image: creatorImg,
    buttonText: "View my resources",
  },
  {
    id: 2,
    name: "Go Explore, Make",
    description: "Design and technology resources",
    image: creatorImg,
    buttonText: "View my resources",
  },
  {
    id: 3,
    name: "Go Explore, Make",
    description: "Design and technology resources",
    image: creatorImg,
    buttonText: "View my resources",
  },
  {
    id: 4,
    name: "Go Explore, Make",
    description: "Design and technology resources",
    image: creatorImg,
    buttonText: "View my resources",
  },
  {
    id: 5,
    name: "Go Explore, Make",
    description: "Design and technology resources",
    image: creatorImg,
    buttonText: "View my resources",
  },
  {
    id: 6,
    name: "Go Explore, Make",
    description: "Design and technology resources",
    image: creatorImg,
    buttonText: "View my resources",
  },
]

const sellMoreCard = {
  title: "Sell more with StudyBlocks",
  description: "Improve your personal, department or school budget with our fully managed marketplace.",
  features: [
    "Industry leading commission",
    "Sell More With Our Print On Demand Service",
    "Enhance Your Learning Resources With Our AI Tools",
  ],
  buttonText: "Learn more",
  icon: sellMoreIcon,
}

function CreatorsCard() {
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
                className="bg-white rounded-[16px] border-2 border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition-all"
              >
                <Image
                  src={card.image}
                  alt={card.name}
                  className="rounded-full mb-4"
                />
                <h3 className="text-lg font-bold text-center mb-2">{card.name}</h3>
                <p className="text-gray-600 text-sm font-medium text-center mb-4">
                  {card.description}
                </p>
                <button className="mt-auto bg-[#E3E6EB] text-black font-bold py-2 px-4 rounded-lg text-sm hover:bg-opacity-90 transition-all">
                  {card.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Sell more card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="col-span-12 lg:col-span-4 h-full hover:shadow-md transition-all"
        >
          <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6 h-full">
            <div className="mb-6">
              <Image
                src={sellMoreCard.icon}
                alt="Sell more"
                className="mb-4 mx-auto"
              />
              <h2 className="text-2xl font-bold text-center text-[#0765FF] mb-3">{sellMoreCard.title}</h2>
              <p className="text-gray-600 text-center text-md font-medium mb-6">{sellMoreCard.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              {sellMoreCard.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#353D6B] text-center py-3 px-4 rounded-full text-md font-medium text-white"
                >
                  {feature}
                </div>
              ))}
            </div>

            <button className="w-full bg-[#0765FF] text-white font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-opacity-90 transition-all">
              {sellMoreCard.buttonText}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CreatorsCard