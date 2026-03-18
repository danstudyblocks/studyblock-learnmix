import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const { newEmail, password } = req.body;

        if (!newEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "New email and password are required",
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
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

        // Get auth module to verify password
        const authModuleService = req.scope.resolve(Modules.AUTH);

        try {
            // Verify password by attempting to authenticate
            await authModuleService.authenticate("customer", "emailpass", {
                email: customer.email,
                password: password,
            });

            // Check if new email is already in use
            const existingCustomers = await customerModuleService.listCustomers({
                email: newEmail,
            });

            if (existingCustomers.length > 0 && existingCustomers[0].id !== customerId) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use",
                });
            }

            // Update customer email
            await customerModuleService.updateCustomers(customerId, {
                email: newEmail,
            });

            // Update auth identity email
            const authIdentities = await authModuleService.listAuthIdentities({
                provider_identities: {
                    provider: "emailpass",
                    entity_id: customerId,
                },
            });

            if (authIdentities.length > 0) {
                await authModuleService.updateAuthIdentities(authIdentities[0].id, {
                    provider_metadata: {
                        email: newEmail,
                    },
                });
            }

            return res.json({
                success: true,
                message: "Email changed successfully",
                email: newEmail,
            });
        } catch (authError) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    } catch (error: any) {
        console.error("Error changing email:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to change email",
        });
    }
};
