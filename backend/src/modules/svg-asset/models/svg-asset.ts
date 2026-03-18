import { model } from "@medusajs/framework/utils"

const SvgAsset = model.define("svg_asset", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  creator_id: model.text().nullable(), // user who created the asset
  is_premium: model.boolean().default(false), // true = premium, false = free
  category_top: model.text().nullable(), // top-level category
  category_sub: model.text().nullable(), // sub-category
  tags: model.array().nullable(), // Array of tags associated with the asset
  thumbnail: model.text().nullable(), // URL to the thumbnail image
  svg_url: model.text(), // URL to the SVG file
  file_id: model.text(), // File ID in storage system
  mime_type: model.text().default("image/svg+xml"),
  file_size: model.number().nullable(), // File size in bytes
  dimensions: model.json().nullable(), // SVG dimensions {width, height}
})

export default SvgAsset
