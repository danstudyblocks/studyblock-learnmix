import {
  createStep,
  StepResponse
} from "@medusajs/framework/workflows-sdk"
import {
  INotificationModuleService,
  IFileModuleService,
  IOrderModuleService
} from "@medusajs/framework/types"
import { ModuleRegistrationName, Modules } from "@medusajs/framework/utils"
import { DigitalProductOrder, MediaType } from "../../../modules/digital-product/types"
import { DIGITAL_ORDER_PLACED } from "@/modules/email-notifications/templates/digital-order-placed"
import { EmailTemplates } from "@/modules/email-notifications/templates"

type SendDigitalOrderNotificationStepInput = {
  digital_product_order: DigitalProductOrder
}

export const sendDigitalOrderNotificationStep = createStep(
  "send-digital-order-notification",
  async ({
    digital_product_order: digitalProductOrder
  }: SendDigitalOrderNotificationStepInput,
    { container }) => {
    const notificationModuleService: INotificationModuleService = container
      .resolve(ModuleRegistrationName.NOTIFICATION)
    const fileModuleService: IFileModuleService = container.resolve(
      ModuleRegistrationName.FILE
    )

    const notificationData = await Promise.all(
      digitalProductOrder.products.map(async (product) => {
        const medias = []

        await Promise.all(
          product.medias
            .filter((media) => media.type === MediaType.MAIN)
            .map(async (media) => {
              medias.push(
                (await fileModuleService.retrieveFile(media.fileId)).url
              )
            })
        )

        return {
          name: product.name,
          medias
        }
      })
    )

      const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER)
    

    const order = await orderModuleService.retrieveOrder(digitalProductOrder.order.id, { relations: ['items', 'summary', 'shipping_address'] })
    const shippingAddress = await (orderModuleService as any).orderAddressService_.retrieve(order.shipping_address.id)

    try {
      const notification = await notificationModuleService.createNotifications({
        to: digitalProductOrder.order.email,
        template: EmailTemplates.DIGITAL_ORDER_PLACED,
        channel: "email",
        data: {
          emailOptions: {
            replyTo: 'dan@studyblocks.ai',
            subject: 'Your Digital order has been placed'
          },
          order,
          shippingAddress,
          preview: 'Thank you for your order!',
          notificationData: notificationData
        }
      });
      return new StepResponse(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }

  }
)