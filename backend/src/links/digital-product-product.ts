import DigitalProductModule from "../modules/digital-product"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: DigitalProductModule.linkable.digitalProduct,
    deleteCascade: false // Don't delete product when digital product is deleted
  },
  ProductModule.linkable.product
)

