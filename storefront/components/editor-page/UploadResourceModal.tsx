"use client";

import { useState, useRef } from "react";
import { X, Upload as UploadIcon } from "lucide-react";
import Image from "next/image";

interface UploadResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer?: any;
}

const UploadResourceModal = ({ isOpen, onClose, customer }: UploadResourceModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Check file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'image/jpeg',
                'image/png',
                'image/jpg'
            ];
            
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
            } else {
                alert("Please upload a PDF, DOC, PPT, or image file");
            }
        }
    };

    const handleUpload = async () => {
        if (!customer?.id) {
            alert("Please sign in to upload resources");
            return;
        }

        if (!title.trim()) {
            alert("Please enter a resource title");
            return;
        }

        if (!file) {
            alert("Please select a file to upload");
            return;
        }

        setIsUploading(true);

        try {
            // First, upload the file to get a URL (you'll need to implement file storage)
            // For now, we'll create a data URL as a placeholder
            const reader = new FileReader();
            const fileDataUrl = await new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });

            // Call the backend API to create the product
            console.log('Uploading to:', `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/resources/upload`);
            console.log('Customer ID:', customer.id);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/resources/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    description,
                    file_url: fileDataUrl, // In production, upload to S3 first and use that URL
                    customer_id: customer.id,
                }),
            });

            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response result:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            alert(`Resource uploaded successfully! Product ID: ${result.product?.id}`);
            console.log('Created product:', result.product);
            
            // Reset form
            setTitle("");
            setDescription("");
            setFile(null);
            onClose();
        } catch (error) {
            console.error("Error uploading resource:", error);
            alert(`Failed to upload resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'image/jpeg',
                'image/png',
                'image/jpg'
            ];
            
            if (allowedTypes.includes(droppedFile.type)) {
                setFile(droppedFile);
            } else {
                alert("Please upload a PDF, DOC, PPT, or image file");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {customer?.metadata?.avatar_url ? (
                                <Image
                                    src={customer.metadata.avatar_url}
                                    alt={customer.first_name || "User"}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-lg font-semibold text-gray-600">
                                    {customer?.first_name?.charAt(0) || customer?.email?.charAt(0) || 'U'}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-semibold">
                            {customer?.first_name ? `${customer.first_name} ${customer.last_name || ''}` : 'Upload Resource'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side - Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter resource title"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your resource"
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Right Side - File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload File
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all h-[200px]"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                
                                {file ? (
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="mt-2 text-xs text-red-600 hover:text-red-700"
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <UploadIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                            Click to upload a file
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PDF, DOC, PPT, or image files
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-medium text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={isUploading || !title.trim() || !file}
                            className="flex-1 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? "Uploading..." : "Upload Resource"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadResourceModal;
