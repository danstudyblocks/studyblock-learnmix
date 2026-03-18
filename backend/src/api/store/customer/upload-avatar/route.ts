import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/framework/utils";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";

export const POST = async (req: AuthenticatedMedusaRequest<any>, res: MedusaResponse) => {
    try {
        console.log("Incoming POST request to upload avatar.");

        // Retrieve uploaded files from the request
        //@ts-ignore
        const files = req.files as Express.Multer.File[];

        // Validate uploaded files
        if (!files?.length) {
            console.warn("No files were uploaded.");
            throw new MedusaError(MedusaError.Types.INVALID_DATA, "No files were uploaded");
        }
        console.log("Uploaded files:", files);

        // Upload the files (assuming avatar files are images, here using a similar workflow as product)
        const { result: uploadedFiles } = await uploadFilesWorkflow(req.scope).run({
            input: {
                files: files.map((file) => ({
                    filename: file.originalname,
                    mimeType: file.mimetype,
                    content: file.buffer,
                    access: "public", // Use "public" access for avatars
                })),
            },
        });

        // Assuming we take the first uploaded file as the avatar
        const avatarUrl = uploadedFiles[0]?.url;
        console.log("Avatar URL:", avatarUrl);

        // Retrieve customer (creator) details using the customer ID from authentication context
        const customerId = req.auth_context.actor_id;
        console.log("Customer ID:", customerId);

        const customerModuleService = req.scope.resolve(Modules.CUSTOMER);

        // Update customer metadata with the new avatar URL
        await customerModuleService.updateCustomers(customerId, {
            metadata: {
                avatar_url: avatarUrl, // Store avatar URL in the customer's metadata
            },
        });

        // Return success message with the avatar URL
        res.json({
            success: true,
            message: "Avatar uploaded and customer updated successfully",
            avatar_url: avatarUrl,
        });
    } catch (error) {
        console.error("Error uploading avatar:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An unexpected error occurred.",
        });
    }
};
