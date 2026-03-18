import { Module } from "@medusajs/framework/utils"
import SubscriptionModuleService from "./service"
import Subscription from "./models/subscription"

export const SUBSCRIPTION_MODULE = "subscriptionModuleService"

export default Module(SUBSCRIPTION_MODULE, {
  service: SubscriptionModuleService,
  linkable: {
    subscription: Subscription
  }
})