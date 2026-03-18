//@ts-nocheck
import { 
  AuthenticatedMedusaRequest, 
  MedusaResponse
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  const result = await query.graph({
    entity: "subscription",
    ...req.queryConfig,
  })
  console.log("result subscriptin:", result)

  const subscriptions = result?.data ?? []
  const metadata = result?.metadata ?? {}
  const count = metadata?.count ?? 0
  const take = metadata?.take ?? 0
  const skip = metadata?.skip ?? 0

  res.json({
    subscriptions,
    count,
    limit: take,
    offset: skip
  })
}
