import { defineMiddlewares } from "@medusajs/medusa"
import { authenticate } from "@medusajs/medusa/api/middlewares"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/resources/upload",
      method: ["POST"],
      middlewares: [authenticate("customer", ["session", "bearer", "api-key"])],
    },
  ],
})
