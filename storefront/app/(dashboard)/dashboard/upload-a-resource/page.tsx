"use client"
import { useState } from "react";
import { PiBriefcase, PiCurrencyDollar, PiImage, PiTag } from "react-icons/pi";
import { createVendorProduct } from "@/lib/data/vendor";

interface ProductVariant {
  title: string;
  prices: { currency_code: string; amount: number }[];
  options: Record<string, string>;
}

function VendorProductUpload() {
  const [productData, setProductData] = useState({
    title: "",
    description: "", // Add description to the state
    status: "draft",
    options: [{ title: "Color", values: ["Blue"] }],
    variants: [] as ProductVariant[],
  });

  const [file, setFile] = useState<File | null>(null); // For the file
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Append the fields to formData, ensuring options and variants are sent as arrays
      formData.append("title", productData.title);
      formData.append("description", productData.description); // Append description
      formData.append("status", productData.status);

      // Directly append the arrays, not stringified objects
      formData.append("options", JSON.stringify(productData.options)); // This should remain an array in the body
      formData.append("variants", JSON.stringify(productData.variants)); // Same for variants

      // Append the file
      const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (fileInput?.files?.[0]) {
        formData.append("files", fileInput.files[0]); // 'files' is the expected key in the backend
      }

      const result = await createVendorProduct(formData); // Pass the FormData object
      if (result.success) {
        setSuccessMessage("Your resource has been uploaded successfully. It will be published after admin review.");
        setProductData({
          title: "",
          description: "", // Reset description
          status: "draft",
          options: [{ title: "Color", values: ["Blue"] }],
          variants: [] as ProductVariant[],
        });
      } else {
        console.error("Resource upload failed", result.error);
        setSuccessMessage("Failed to upload the resource. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error", error);
      setSuccessMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Upload Your Resource
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Fill in the details below to upload your product or resource.
        </p>

        {successMessage && (
          <div
            className={`mb-4 text-sm font-medium p-3 rounded-lg ${successMessage.includes("successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3">
            <PiTag className="text-xl text-gray-500" />
            <input
              type="text"
              placeholder="Resource Title"
              value={productData.title}
              onChange={(e) =>
                setProductData({ ...productData, title: e.target.value })
              }
              className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3">
            <PiBriefcase className="text-xl text-gray-500" />
            <textarea
              placeholder="Resource Description"
              value={productData.description}
              onChange={(e) =>
                setProductData({ ...productData, description: e.target.value })
              }
              className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none h-20 resize-none" // Adjust the height here (h-20)
            />
          </div>


          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3">
            <PiCurrencyDollar className="text-xl text-gray-500" />
            <input
              type="number"
              placeholder="Price"
              onChange={(e) =>
                setProductData({
                  ...productData,
                  variants: [
                    {
                      title: productData.title,
                      prices: [
                        { currency_code: "eur", amount: Number(e.target.value) },
                      ],
                      options: { Color: "Blue" },
                    },
                  ],
                })
              }
              className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3">
            <PiImage className="text-xl text-gray-500" />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-lg transition duration-200"
          >
            Upload Resource
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorProductUpload;
