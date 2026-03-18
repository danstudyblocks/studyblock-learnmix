"use client"
import { submitPaymentInfo } from '@/lib/data/vendor';
import React, { useState } from 'react';
import { PiBuildingsBold, PiBank, PiBankBold, PiUserBold } from "react-icons/pi";

const VendorPaymentForm = ({ customer }: any) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // Track success state

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            // Handle form submission
            await submitPaymentInfo(formData, customer);
            setIsLoading(false);
            setIsSuccess(true); // Set success state to true after submission
            setTimeout(() => {
                setIsSuccess(false); // Optionally hide success message after 5 seconds
            }, 5000);
        } catch (error: any) {
            setIsLoading(false);
            setError(error.message);
        }
    };

    return (
        <section className="relative overflow-hidden">
            <div className="flex h-full w-full max-w-[530px] flex-col items-start justify-start max-lg:px-6 lg:ml-20 xl:max-w-[380px] xxl:max-w-[530px]">
                <div className="flex items-center justify-start pt-8">
                    <p className="heading-5">Payment Information</p>
                </div>

                {isSuccess ? (
                    <div className="w-full text-center p-6">
                        <p className="text-green-500">Payment Information Saved Successfully!</p>
                    </div>
                ) : (
                    <form className="flex w-full flex-col pt-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex w-full items-center gap-3 rounded-2xl border border-n30 px-4 py-3 focus-within:border-b300">
                                <span className="text-2xl !leading-none text-n300">
                                    <PiUserBold />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Account Holder Name"
                                    name="accountHolder"
                                    required
                                    className="w-full text-sm text-n300 outline-none"
                                />
                            </div>

                            <div className="flex w-full items-center gap-3 rounded-2xl border border-n30 px-4 py-3 focus-within:border-b300">
                                <span className="text-2xl !leading-none text-n300">
                                    <PiBankBold />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Bank Name"
                                    name="bankName"
                                    required
                                    className="w-full text-sm text-n300 outline-none"
                                />
                            </div>

                            <div className="flex w-full items-center gap-3 rounded-2xl border border-n30 px-4 py-3 focus-within:border-b300">
                                <span className="text-2xl !leading-none text-n300">
                                    <PiBank />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Account Number"
                                    name="accountNumber"
                                    required
                                    className="w-full text-sm text-n300 outline-none"
                                />
                            </div>

                            <div className="flex w-full items-center gap-3 rounded-2xl border border-n30 px-4 py-3 focus-within:border-b300">
                                <span className="text-2xl !leading-none text-n300">
                                    <PiBuildingsBold />
                                </span>
                                <input
                                    type="text"
                                    placeholder="SWIFT/BIC Code"
                                    name="swiftCode"
                                    required
                                    className="w-full text-sm text-n300 outline-none"
                                />
                            </div>

                            {error && (
                                <div
                                    role="alert"
                                    className="flex items-center justify-start gap-2 rounded-md border border-r300 bg-r100/10 px-4 py-3 text-sm text-r300"
                                >
                                    <span className="font-medium">Error:</span> {error}
                                </div>
                            )}
                        </div>

                        <div className="w-full pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl px-4 py-3 font-semibold text-white duration-700 ${isLoading
                                    ? "bg-b200 cursor-not-allowed"
                                    : "bg-b300 hover:bg-b400"
                                }`}
                            >
                                {isLoading ? (
                                    <span className="loader-spinner h-5 w-5 border-2 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <span>Save Payment Information</span>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default VendorPaymentForm;
