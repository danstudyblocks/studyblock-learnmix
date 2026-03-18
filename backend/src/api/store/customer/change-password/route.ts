import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        // Get authenticated customer ID
        const customerId = req.auth_context?.actor_id;
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }

        // Get customer service
        const customerModuleService = req.scope.resolve(Modules.CUSTOMER);
        const customer = await customerModuleService.retrieveCustomer(customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        // Get auth module to verify current password and update
        const authModuleService = req.scope.resolve(Modules.AUTH);

        try {
            // Verify current password by attempting to authenticate
            await authModuleService.authenticate("customer", "emailpass", {
                email: customer.email,
                password: currentPassword,
            });

            // If authentication succeeds, update the password
            // Note: Medusa v2 auth module doesn't have a direct password update method
            // You may need to delete and recreate the auth identity
            const authIdentities = await authModuleService.listAuthIdentities({
                provider_identities: {
                    provider: "emailpass",
                    entity_id: customerId,
                },
            });

            if (authIdentities.length > 0) {
                // Delete old auth identity
                await authModuleService.deleteAuthIdentities(authIdentities[0].id);
            }

            // Create new auth identity with new password
            await authModuleService.createAuthIdentities({
                provider: "emailpass",
                entity_id: customerId,
                provider_metadata: {
                    email: customer.email,
                    password: newPassword,
                },
            });

            return res.json({
                success: true,
                message: "Password changed successfully",
            });
        } catch (authError) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }
    } catch (error: any) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to change password",
        });
    }
};
