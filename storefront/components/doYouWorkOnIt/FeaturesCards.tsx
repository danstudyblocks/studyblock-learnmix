import Image from "next/image"
import { motion } from "framer-motion"
import sellMoreIcon from "@/public/svg/sell-more-icon.svg"
import customMailIcon from "@/public/svg/custom-mail-icon-1.svg"
import freeDesignIcon from "@/public/svg/free-design-icon.svg"
import aiToolIcon from "@/public/svg/ai-tool-icon.svg"
import bespokeBookIcon from "@/public/svg/bespoke-book-icon.svg"
import philHoltonIcon from "@/public/svg/phil-holton-icon.svg"
import { FiPlus } from "react-icons/fi"
import Link from "next/link"

// Creator card data
const creatorCards = [
  {
    id: 1,
    name: "",
    description:
      "Studyblocks saves me valuable time that I can use on other essential tasks such as assessment or prepping materials.",
    point: "Nathan Goddard",
    point2: "Studyblocks Creator",
    image: sellMoreIcon,
    buttonText: "View my resources",
    link:"/dashboard/home"
  },
  {
    id: 2,
    name: "",
    description:
      "Working with StudyBlocks to provide visually strong and effective education materials, made a massive difference to the quality of our customer support.",
    point: "Phil Holton",
    point2: "Pearson",
    image: philHoltonIcon,
    buttonText: "View my resources",
    link:"/dashboard/home"
  },
  {
    id: 3,
    name: "",
    description:
      "Studyblocks is my go-to and my answer after years of trying to develop resources to a high professional standard.",
    point: "Bismark Sem-Brako",
    point2: "Studyblocks creator",
    image: sellMoreIcon,
    buttonText: "View my resources",
    link:"/dashboard/home"
  },
  {
    id: 4,
    name: "Bespoke books, for everyone!",
    description: "Design and print your own books with us!",
    image: bespokeBookIcon,
    buttonText: "Learn more",
    link:"/book-design-studio"
  },
  {
    id: 5,
    name: "Free AI tools",
    description: "Create new resources in seconds with our free AI tools",
    image: aiToolIcon,
    buttonText: "Upload new file",
    link:"/dashboard/upload-a-resource"
  },
  {
    id: 6,
    name: "Free design for teachers",
    description:
      "Upload your resource and get it enhanced with professional design and AI, ",
    highlightText: "free of charge!",
    image: freeDesignIcon,
    buttonText: "Upload a resource",
    "link":"/dashboard/upload-a-resource"
  },
]

const sellMoreCard = {
  title: "Inbox",
  description: "Become part of our community to enjoy exclusive discounts, news and downloads.",
  buttonText: "Join",
  icon: customMailIcon,
}

function FeaturesCards() {
  return (
    <div className="container">
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Left side - Creator cards */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {creatorCards.map((card, index) => (
              <div key={index}>
                {card.id <=3 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-[16px] border-2 border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition-all"
                  >
                    <div className="flex flex-row justify-between items-center gap-2">
                      <Image
                        src={card.image}
                        alt={card.name}
                        className="mb-4 w-[2.5em] h-[2.5em] "
                      />

                      <div>
                        <p className="text-black text-[12px] font-medium mb-4">
                          {card.description}
                        </p>
                        <span className="text-sm text-[#0765FF] font-bold">
                          <p>{card.point}</p>
                          <p>{card.point2}</p>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-[16px] border-2 border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition-all"
                  >
                    <Image src={card.image} alt={card.name} className="mb-4" />
                    <h3 className="text-md font-bold mb-2">{card.name}</h3>
                    <p className="text-gray-600 text-sm font-medium mb-4">
                      {card.description}{" "}
                      <span className="font-bold text-[#0765FF]">
                        {card.highlightText}
                      </span>
                    </p>
                    <Link href={card.link} >
                        <button
                          className={`mt-auto ${card.id === 6
                              ? "bg-[#0765FF] text-white"
                              : "bg-[#E3E6EB] text-black"
                            }  font-bold py-2 px-4 rounded-lg text-sm hover:bg-opacity-90 transition-all`}
                        >
                          {card.buttonText}
                        </button>
                    </Link>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Inbox card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="col-span-12 lg:col-span-3 h-full"
        >
          <div className="bg-white rounded-[16px] border-2 border-gray-200 p-6 flex flex-col items-center h-full">
            <div className="flex-1" />
            <div className="flex flex-col items-center">
              <Image
                src={sellMoreCard.icon}
                alt={sellMoreCard.title}
                width={160}
                height={160}
                className="mb-6"
              />
              <h2 className="text-2xl font-bold text-center mb-3">
                {sellMoreCard.title}
              </h2>
              <p className="text-gray-600 text-center text-sm font-medium mb-6">
                {sellMoreCard.description}
              </p>
            </div>
            
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Email"
                className="w-full sm:flex-1 px-4 py-2.5 bg-[#E3E6EB] rounded-lg text-sm placeholder-black focus:outline-none focus:ring-2 focus:ring-[#0765FF] text-black"
              />
              <button className="w-full sm:w-auto bg-[#0765FF] text-white font-bold py-2.5 px-4 rounded-lg text-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-1">
                <FiPlus className="text-lg" /> {sellMoreCard.buttonText}
              </button>
            </div>
            <div className="flex-1" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FeaturesCards
