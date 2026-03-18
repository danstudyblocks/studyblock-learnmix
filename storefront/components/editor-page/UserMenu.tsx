"use client";

import { useState, useRef, useEffect } from "react";
import { User, Package, Heart, Newspaper, HelpCircle, Mail, Shield, FileText, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";
import { signout } from "@/lib/data/customer";
import dummy_profile from "@/public/design-edit-icons-and-svgs/icons/dummy_profile.svg";

interface UserMenuProps {
    customer?: any;
}

const UserMenu = ({ customer }: UserMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const url = customer?.metadata?.avatar_url;
        setAvatarUrl(url || "");
    }, [customer]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        setIsOpen(false);
        await signout();
    };

    const menuItems = [
        { icon: User, label: "Profile", href: "/profile" },
        { icon: Package, label: "My Resources", href: "/my-resources" },
        { icon: Heart, label: "My Favourites", href: "/favourites" },
        { icon: Newspaper, label: "Newsletter", href: "/newsletter" },
    ];

    // If user is NOT logged in, show Sign Up and Sign In buttons
    if (!customer) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/sign-up"
                    className="items-center flex font-medium justify-center text-center whitespace-nowrap h-9 bg-white border border-black/20 text-black px-4 py-2 rounded-full hover:bg-gray-50 transition-colors text-[14px] gap-[8px] leading-[20px]"
                >
                    Sign Up
                </Link>
                <Link
                    href="/sign-in"
                    className="items-center flex font-medium justify-center text-center whitespace-nowrap h-9 bg-black text-white px-4 py-2 rounded-full hover:bg-black/90 transition-colors text-[14px] gap-[8px] leading-[20px]"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    // If user IS logged in, show profile avatar with dropdown
    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Account menu"
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center p-0 border-0 hover:opacity-90 transition-opacity"
            >
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt="profile"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-700 text-lg font-semibold">
                            {customer?.first_name?.charAt(0)?.toUpperCase() || customer?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    {/* Menu Items */}
                    <div className="py-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                            >
                                <item.icon className="w-4 h-4 text-gray-500" />
                                <span className="text-[14px]">{item.label}</span>
                            </Link>
                        ))}
                        <a
                            href="mailto:hello@learnmix.com"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                        >
                            <HelpCircle className="w-4 h-4 text-gray-500" />
                            <span className="text-[14px]">Help</span>
                        </a>
                        <a
                            href="mailto:hello@learnmix.com"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                        >
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-[14px]">Contact Us</span>
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200" />

                    {/* Legal Items */}
                    <div className="py-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setIsPrivacyModalOpen(true);
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 w-full"
                        >
                            <Shield className="w-4 h-4 text-gray-500" />
                            <span className="text-[14px]">Privacy Policy</span>
                        </button>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setIsTermsModalOpen(true);
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 w-full"
                        >
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-[14px]">Terms of Service</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200" />

                    {/* Logout */}
                    <div className="py-1">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600 w-full"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-[14px]">Log Out</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Terms Modal */}
            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
            />

            {/* Privacy Modal */}
            <PrivacyModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />
        </div>
    );
};

export default UserMenu;
