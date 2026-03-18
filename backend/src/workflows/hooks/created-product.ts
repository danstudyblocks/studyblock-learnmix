import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { 
  ICustomerModuleService, 
} from "@medusajs/framework/types";

createProductsWorkflow.hooks.productsCreated(
  (async ({ products, additional_data }, { container }) => {
    if (!additional_data?.customer_id) {
      return new StepResponse([], [])
    }

    // Check if customer exists
    const customerModuleService: ICustomerModuleService = container.resolve(
      Modules.CUSTOMER
    )
    await customerModuleService.retrieveCustomer(additional_data.customer_id as string)

    const remoteLink = container.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    const logger = container.resolve(
      ContainerRegistrationKeys.LOGGER
    )

    const links = []

    // Link products to customers
    for (const product of products) {
      links.push({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [Modules.CUSTOMER]: {
          customer_id: additional_data.customer_id,
        },
      })
    }

    await remoteLink.create(links)

    logger.info("Linked customer to products")

    return new StepResponse(links, links)
  })
)
