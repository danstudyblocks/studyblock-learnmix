import { MedusaContainer } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { CustomerDTO } from '@medusajs/types'


export const fetchCustomerByAuthActorId = async (
  authActorId: string,
  scope: MedusaContainer,
  fields: string[] = ['id']
): Promise<CustomerDTO> => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [customer]
  } = await query.graph({
    entity: 'customer',
    filters: {
      id: authActorId
    },
    fields
  })
  
  return customer
}
