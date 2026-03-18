import { model } from "@medusajs/framework/utils"
import DigitalProductMedia from "./digital-product-media"
import DigitalProductOrder from "./digital-product-order"

const DigitalProduct = model.define("digital_product", {
  id: model.id().primaryKey(),
  name: model.text(),
  creator_id: model.text().nullable(), // user who created the template
  is_premium: model.boolean().default(false), // true = premium, false = free
  show_in_studio: model.boolean().default(false),
  category_top: model.text().nullable(), // top-level category
  category_sub: model.text().nullable(), // sub-category
  tags: model.array().nullable(), // Array of tags associated with the template
  thumbnail: model.text().nullable(), // URL to the thumbnail image
  isTemplate: model.boolean().default(false), // true if this is a template, false if it's a product
  template_data: model.json().nullable(), // stores polotno json
  // approval_status: model.text().default("pending"), // pending, approved, rejected - temporarily commented out until migration runs
  medias: model.hasMany(() => DigitalProductMedia, {
    mappedBy: "digitalProduct"
  }),
  orders: model.manyToMany(() => DigitalProductOrder, {
    mappedBy: "products"
  })
})
  .cascades({
    delete: ["medias"]
  })

export default DigitalProduct