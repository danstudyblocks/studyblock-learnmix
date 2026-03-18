import CustomerModule from "@medusajs/medusa/customer"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true, // A customer(creator/vendor) can link to many products
  },
  CustomerModule.linkable.customer // A product links to one customer(creator/vendor)
)
