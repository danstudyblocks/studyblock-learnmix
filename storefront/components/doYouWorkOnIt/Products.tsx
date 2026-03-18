import { useState } from "react"
import { motion } from "framer-motion"
import { FiPlus } from "react-icons/fi"
import Image from "next/image"
import dummyProductImg1 from "@/public/svg/dummy-product-img-1.svg"
import dummyProductImg2 from "@/public/svg/dummy-product-img-2.svg"
import Link from "next/link"

// Card data array
const heroCards = [
  {
    id: 1,
    productTitle: "Geography Award",
    productDescription: "Postcards",
    productImage: dummyProductImg1,
    type: "small",
    category: "StudyBlocks",
  },
  {
    id: 2,
    productTitle: "Stay Creative",
    productDescription: "Display",
    productImage: dummyProductImg2,
    type: "small",
    category: "StudyBlocks",
  },
  {
    id: 3,
    productTitle: "Geography Award",
    productDescription: "Postcards",
    productImage: dummyProductImg1,
    type: "small",
    category: "StudyBlocks",
  },
  {
    id: 4,
    productTitle: "Geography Award",
    productDescription: "Postcards",
    productImage: dummyProductImg1,
    type: "small",
    category: "StudyBlocks",
  },
]

function Products({ products }: any) {
  const [data] = useState(heroCards)

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



  return (
    <section className="relative bg-white mb-5">
      <div className="container">
        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-12 gap-6"
        >
          {products?.map((p: any) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[16px] border-2 border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 col-span-12 sm:col-span-6 lg:col-span-3 h-[31em]"
            >
              <Link href={`/products/${p.handle}`} className="flex flex-col h-full p-6">
                {/* Category */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#8B90A1] text-[11px] font-medium mb-2 text-center"
                >
                  {p?.handle}
                </motion.p>

                {/* Product Image */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  {p.thumbnail && (
                    <Image
                      src={p.thumbnail}
                      alt={p.title}
                      height={240}
                      width={100}
                      className="rounded-md mb-[1em] mx-auto w-full h-[240px] object-contain"
                    />
                  )}
                </motion.div>

                {/* Product Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[20px] text-center font-semibold text-black mb-2"
                >
                  {p.title}
                </motion.h2>

                {/* Product Description */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#545A70] text-[16px] font-medium mb-6 text-center"
                >
                  {p?.subtitle ? p.subtitle : p?.description?.split(" ").slice(0, 5).join(" ")}
                </motion.p>


                {/* Buy Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-fit mx-auto flex items-center justify-center gap-2 bg-[#0765FF] hover:bg-opacity-80 text-white font-bold py-2.5 px-6 rounded-lg transition-all text-[16px] font-semibold hover:shadow-md"
                >
                  <FiPlus className="text-lg" /> Buy
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Products
