"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import diamond_icon from "@/public/design-edit-icons-and-svgs/icons/diamond_icon.svg";
import UpgradeButton from "@/components/editor/UpgradeButton";

export interface PremiumTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer?: any;
    /** When "profile", the upgrade button navigates to /profile. When "checkout", uses UpgradeButton for Stripe checkout. */
    primaryAction?: "profile" | "checkout";
    /** When primaryAction is "profile", called when user clicks Upgrade (e.g. to close parent modal too). If not set, just onClose + router.push("/profile"). */
    onUpgradeClick?: () => void;
}

/**
 * Shared Premium Template modal: same layout and color theme as the design-studio Templates panel modal.
 * Use when gating premium templates (home, editor, design-studio).
 */
export default function PremiumTemplateModal({
    isOpen,
    onClose,
    customer,
    primaryAction = "checkout",
    onUpgradeClick,
}: PremiumTemplateModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleUpgradeClick = () => {
        onClose();
        if (onUpgradeClick) {
            onUpgradeClick();
        } else {
            router.push("/profile");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                    aria-label="Close"
                >
                    ×
                </button>

                <div className="text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Template</h3>
                        <p className="text-gray-600 mb-6">
                            This template is part of our premium collection. Upgrade your account to access all premium templates and unlock unlimited creativity.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Premium Benefits:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Access to all premium templates</li>
                                <li>• High-resolution exports</li>
                                <li>• Advanced editing features</li>
                                <li>• Priority support</li>
                            </ul>
                        </div>

                        {primaryAction === "profile" ? (
                            <button
                                onClick={handleUpgradeClick}
                                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold py-3 px-4 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <Image src={diamond_icon} alt="" className="w-5 h-5" />
                                Upgrade to Premium
                            </button>
                        ) : (
                            <UpgradeButton
                                priceId="price_1RDTdyKKX37RuVxfUcQJZWNJ"
                                creator_id={customer?.id}
                                email={customer?.email}
                                isPremium={customer?.metadata?.isPremium}
                            />
                        )}

                        <button
                            onClick={onClose}
                            className="w-full text-gray-500 py-2 px-4 rounded-lg hover:text-gray-700 transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
