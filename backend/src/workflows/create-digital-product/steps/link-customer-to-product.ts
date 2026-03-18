import {
  createStep,
  StepResponse
} from "@medusajs/framework/workflows-sdk"
import {
  Modules,
  ContainerRegistrationKeys
} from "@medusajs/framework/utils"

type LinkCustomerToProductStepInput = {
  product_id: string
  customer_id: string
}

const linkCustomerToProductStep = createStep(
  "link-customer-to-product",
  async ({ 
    product_id,
    customer_id
  }: LinkCustomerToProductStepInput, { container }) => {
    const remoteLink = container.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    await remoteLink.create({
      [Modules.PRODUCT]: {
        product_id: product_id,
      },
      [Modules.CUSTOMER]: {
        customer_id: customer_id,
      },
    })

    return new StepResponse({
      linked: true
    }, {
      product_id,
      customer_id
    })
  },
  async ({ product_id, customer_id }, { container }) => {
    const remoteLink = container.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    await remoteLink.delete({
      [Modules.PRODUCT]: {
        product_id: product_id,
      },
      [Modules.CUSTOMER]: {
        customer_id: customer_id,
      },
    })
  }
)

export default linkCustomerToProductStep
