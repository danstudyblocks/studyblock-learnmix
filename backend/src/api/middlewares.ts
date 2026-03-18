import {
  defineMiddlewares,
  validateAndTransformQuery,
  authenticate,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { AdminCreateProduct } from "@medusajs/medusa/api/admin/products/validators";
import { z } from "zod";
import multer from "multer";
import { json } from "express";
import {
  createDigitalProductsSchema,
  createVendorProductSchema,
} from "./validation-schemas";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

//@ts-ignore
export const GetCustomSchema: any = createFindParams();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 40 * 1024 * 1024,
  },
});

export default defineMiddlewares({
  routes: [
    {
      matcher: "/",
      method: "GET",
      middlewares: [
        (req, res, next) => {
          res
            .status(200)
            .json({
              message: "Welcome to Studyblocks backend APIs!",
              version: "1.0.0",
            })
            .end();
        },
      ],
    },
    {
      matcher: "/creators/products/create",
      method: "POST",
      middlewares: [
        upload.array("files"),
        authenticate("customer", ["session", "bearer"]),
      ],
    },
    {
      matcher: "/store/customer/upload-avatar",
      method: "POST",
      middlewares: [
        upload.array("files"),
        authenticate("customer", ["session", "bearer"]),
      ],
    },
    {
      matcher: "/store/customer/products",
      method: "GET",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
      ],
    },
    {
      matcher: "/admin/products",
      method: ["POST"],
      additionalDataValidator: {
        //@ts-ignore
        customer_id: z.string().optional(),
      },
    },
    {
      matcher: "/admin/digital-products",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetCustomSchema, {
          defaults: [
            "id",
            "name",
            "creator_id",
            "is_premium",
            "template_data",
            "show_in_studio",
            "category_top",
            "category_sub",
            "tags",
            "thumbnail",
            "isTemplate",
            "medias.*",
            "product_variant.*",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/digital-products",
      method: "POST",
      middlewares: [
        //@ts-ignore
        validateAndTransformBody(createDigitalProductsSchema),
      ],
    },
    {
      matcher: "/store/digital-products",
      method: "POST",
      middlewares: [upload.array("files")],
    },
    {
      matcher: "/store/print-orders",
      method: "POST",
      bodyParser: {
        sizeLimit: "40mb",
      },
      middlewares: [json({ limit: "40mb" })],
    },
    {
      matcher: "/admin/digital-products/:id",
      method: "DELETE",
      middlewares: [],
    },
    {
      matcher: "/admin/digital-products/upload**",
      method: "POST",
      middlewares: [upload.array("files")],
    },
    {
      matcher: "/admin/products/:id/pdf-attachment",
      method: "POST",
      middlewares: [upload.single("file")],
    },
    // SVG Assets
    {
      matcher: "/admin/svg-assets",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetCustomSchema, {
          defaults: [
            "id",
            "name",
            "description",
            "category_top",
            "category_sub",
            "is_premium",
            "creator_id",
            "tags",
            "svg_url",
            "thumbnail",
            "file_id",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/svg-assets/upload",
      method: "POST",
      middlewares: [upload.array("files")],
    },
    // subscription
    {
      matcher: "/admin/subscriptions",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetCustomSchema, {
          defaults: [
            "id",
            "subscription_date",
            "expiration_date",
            "status",
            "metadata.*",
            "orders.*",
            "customer.*",
          ],
          isList: true,
        }),
      ],
    },
    // webhooks - preserve raw body for Stripe signature verification
    {
      matcher: "/hooks/subscription",
      method: "POST",
      bodyParser: {
        preserveRawBody: true,
      },
    },
  ],
});
