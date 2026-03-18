"use client"

import React, { useState, useCallback } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { uploadCustomerAvatar } from "@/lib/data/vendor"
import { updateCustomer } from "@lib/data/customer"

type ProfileAvatarProps = {
    customer: HttpTypes.StoreCustomer
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ customer }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    //@ts-ignore
    const decodedAvatarUrl = customer?.metadata?.avatar_url ? decodeURIComponent(customer.metadata.avatar_url) : null
    const [avatarUrl, setAvatarUrl] = useState<string | null>(decodedAvatarUrl)

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setError(null)
            setSelectedFile(file)
            // Create preview URL
            const fileUrl = URL.createObjectURL(file)
            setPreviewUrl(fileUrl)
        }
    }, [])

    const handleUploadAvatar = useCallback(async () => {
        if (!selectedFile) {
            setError("Please select an image first")
            return
        }

        setUploading(true)
        setError(null)
        const formData = new FormData()
        formData.append("files", selectedFile)

        try {
            const { success, avatar_url, error: uploadError } = await uploadCustomerAvatar(formData)

            if (!success || !avatar_url) {
                throw new Error(uploadError || "Failed to upload avatar")
            }

            setAvatarUrl(avatar_url)
            await updateCustomer({
                metadata: {
                    ...customer.metadata,
                    avatar_url
                }
            })

            // Clean up after successful upload
            setSelectedFile(null)
            setPreviewUrl(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Error uploading avatar"
            setError(errorMessage)
            console.error("Error uploading avatar:", err)
        } finally {
            setUploading(false)
        }
    }, [customer.metadata, selectedFile])

    // Cleanup preview URL when component unmounts
    React.useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    return (
        <div className="col-span-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative max-md:overflow-hidden">
                {(previewUrl || avatarUrl) ? (
                    <Image
                        src={previewUrl || avatarUrl!}
                        alt="Profile Avatar"
                        width={105}
                        height={105}
                        className="object-cover rounded-full"
                        priority
                    />
                ) : (
                    <div className="w-[105px] h-[105px] rounded-full bg-b300 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">
                            {customer?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <label
                        className="cursor-pointer rounded-xl bg-n900 px-5 py-2 text-white hover:bg-n800 transition-colors duration-200"
                        htmlFor="profilePic"
                    >
                        Choose File
                    </label>
                    <button
                        onClick={handleUploadAvatar}
                        disabled={uploading || !selectedFile}
                        className={`rounded-xl px-5 py-2 text-white transition-colors duration-200 ${uploading || !selectedFile
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-b300 hover:bg-b200"
                            }`}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>

                <input
                    type="file"
                    className="hidden"
                    id="profilePic"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                />

                {selectedFile && (
                    <p className="text-sm text-gray-600">
                        Selected: {selectedFile.name}
                    </p>
                )}

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        </div>
    )
}