//@ts-nocheck
import { z } from "zod";
import { MediaType } from "../modules/digital-product/types";
import { AdminCreateProduct } from "@medusajs/medusa/api/admin/products/validators";

export const createDigitalProductsSchema = z.object({
  name: z.string(),
  template_data: z.record(z.any()).nullable().optional(),
  creator_id: z.string().nullable().optional(),
  is_premium: z.boolean(),
  price: z.number().positive().nullable().optional(),
  show_in_studio: z.boolean().default(false),
  category_top: z.string().nullable().optional(),
  category_sub: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  isTemplate: z.boolean().default(false).optional(),
  medias: z.array(z.object({
    type: z.nativeEnum(MediaType),
    file_id: z.string(),
    mime_type: z.string(),
  })),
  product: AdminCreateProduct(),
});

export const createVendorProductSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.string().optional().default("draft"),
  options: z.string().transform((str) => {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  }),
  variants: z.string().transform((str) => {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  }),
});

