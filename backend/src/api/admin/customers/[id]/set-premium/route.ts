import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

// Admin endpoint to manually set a customer as Premium (for testing)
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const customerId = req.params.id;
    const { isPremium } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const customerModule = req.scope.resolve(Modules.CUSTOMER);
    
    await customerModule.updateCustomers(customerId, {
      metadata: {
        isPremium: isPremium !== false,
        subscriptionStatus: isPremium !== false ? "active" : "inactive",
      },
    });

    return res.json({
      success: true,
      message: `Customer ${isPremium !== false ? 'upgraded to' : 'removed from'} Premium`,
    });
  } catch (error: any) {
    console.error("Error updating customer premium status:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update customer",
    });
  }
};
