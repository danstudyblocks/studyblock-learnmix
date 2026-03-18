"use client";

import { useState, useEffect } from "react";
import { SquarePen, ArrowLeft, Camera, User, Mail, Lock, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserMenu from "../editor-page/UserMenu";
import { updateCustomer, changePassword, createProCheckoutSession, confirmProSubscription } from "@/lib/data/customer";
import { uploadCustomerAvatar } from "@/lib/data/vendor";
import {
    PiCheckCircle
} from "react-icons/pi";

interface ProfilePageProps {
    customer: any;
}

const ProfilePage = ({ customer }: ProfilePageProps) => {
    const router = useRouter();
    const [firstName, setFirstName] = useState(customer?.first_name || '');
    const [lastName, setLastName] = useState(customer?.last_name || '');
    const [email, setEmail] = useState(customer?.email || '');
    const [storeDescription, setStoreDescription] = useState(customer?.metadata?.store_description || '');
    const [username, setUsername] = useState(customer?.metadata?.username || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(customer?.metadata?.avatar_url || '');
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isProConfirmed, setIsProConfirmed] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const subscriptionStatus = params.get("subscription");
        const sessionId = params.get("session_id");

        if (subscriptionStatus === "success") {
            (async () => {
                if (sessionId) {
                    try {
                        const result = await confirmProSubscription(sessionId);
                        if (result.success) {
                            setIsProConfirmed(true);
                            await router.refresh();
                        }
                    } catch (e) {
                        console.error("Confirm subscription:", e);
                    }
                }
                window.history.replaceState({}, "", "/profile");
                router.refresh();
                alert("Welcome to Learnmix Pro! You now have access to all Pro templates and resources.");
            })();
        } else if (subscriptionStatus === "cancelled") {
            window.history.replaceState({}, "", "/profile");
            alert("Subscription upgrade was cancelled.");
        }
    }, [router]);

    const handleUpgradeToPro = async () => {
        setIsUpgrading(true);
        try {
            const result = await createProCheckoutSession();

            if (!result.success) {
                throw new Error(result.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe checkout
            if (result.url) {
                window.location.href = result.url;
            }
        } catch (error: any) {
            console.error("Error upgrading to Pro:", error);
            alert(error.message || "Failed to start upgrade process");
            setIsUpgrading(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Update customer profile (first_name, last_name, and metadata)
            const updateData: any = {
                first_name: firstName,
                last_name: lastName,
                metadata: {
                    ...customer?.metadata,
                    store_description: storeDescription,
                    username: username.trim() || undefined,
                },
            };

            await updateCustomer(updateData);
            
            alert("Profile updated successfully!");
            
            // Refresh the page to show updated data
            router.refresh();
        } catch (error: any) {
            console.error("Error updating profile:", error);
            alert(error.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        // Validate password fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            alert("New password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);
        try {
            const result = await changePassword(currentPassword, newPassword);

            if (!result.success) {
                throw new Error(result.error || 'Failed to change password');
            }

            alert("Password changed successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error("Error changing password:", error);
            alert(error.message || "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form
        setFirstName(customer?.first_name || '');
        setLastName(customer?.last_name || '');
        setEmail(customer?.email || '');
        setStoreDescription(customer?.metadata?.store_description || '');
        setUsername(customer?.metadata?.username || '');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('files', file);

            const result = await uploadCustomerAvatar(formData);
            
            if (result.success) {
                setAvatarUrl(result.avatar_url);
                alert("Profile photo updated successfully!");
                router.refresh();
            } else {
                alert(result.error || "Failed to upload photo");
            }
        } catch (error: any) {
            console.error("Error uploading photo:", error);
            alert("Failed to upload photo");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen">
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col w-full">
                    <div className="h-px"></div>
                    
                    {/* Header */}
                    <div className="border-b ml-[2px] bg-[rgb(252,250,248)] border-black/0 p-4">
                        <div className="w-full">
                            <div className="items-center flex justify-between gap-[12px]">
                                <div className="items-center flex grow basis-[0%] gap-[16px]">
                                    <Link 
                                        href="/"
                                        className="items-center flex h-10 hover:opacity-80 transition-opacity cursor-pointer"
                                        aria-label="Go to homepage"
                                    >
                                        <div className="ml-auto mr-auto text-center">
                                            <span 
                                                className="text-2xl font-light tracking-tight"
                                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                            >
                                                learnmix
                                            </span>
                                        </div>
                                    </Link>
                                    
                                    <div className="flex justify-end w-full gap-2 items-center">
                                        <Link 
                                            href="/design-studio"
                                            className="items-center flex font-medium justify-center text-center whitespace-nowrap h-9 bg-white border border-black/20 text-black px-4 py-2 rounded-full hover:bg-gray-50 transition-colors text-[14px] gap-[8px] leading-[20px]"
                                        >
                                            <SquarePen className="w-4 h-4" />
                                            Editor
                                        </Link>
                                        
                                        <UserMenu customer={customer} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col justify-center w-full pt-0 pr-0 pb-8 pl-0 bg-[rgb(252,250,248)] min-h-screen">
                        <div className="ml-auto mr-auto w-full max-w-4xl pt-0 pr-4 pb-0 pl-4">
                            
                            {/* Page Header */}
                            <div className="flex items-center justify-between py-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => router.back()}
                                        className="w-10 h-10 bg-white border border-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h1 
                                        className="text-3xl font-light"
                                        style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                                    >
                                        Profile Settings
                                    </h1>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex gap-2">
                                    <Link
                                        href="/my-resources"
                                        className="px-4 py-2 text-sm border border-black/20 bg-white text-black rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        My Resources
                                    </Link>
                                    <Link
                                        href="/favourites"
                                        className="px-4 py-2 text-sm border border-black/20 bg-white text-black rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        My Favourites
                                    </Link>
                                </div>
                                <div>
                                    <a
                                        href="mailto:hello@learnmix.com"
                                        className="px-4 py-2 text-sm border border-black/20 bg-white text-black rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Help
                                    </a>
                                </div>
                            </div>

                            {/* Profile & Subscription Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Profile Photo Card */}
                                <div className="bg-white rounded-3xl border border-gray-200 p-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-100">
                                                {avatarUrl ? (
                                                    <Image
                                                        src={avatarUrl}
                                                        alt="Profile"
                                                        width={128}
                                                        height={128}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-4xl font-semibold text-gray-600">
                                                        {firstName?.charAt(0) || email?.charAt(0) || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                            <label 
                                                htmlFor="photo-upload"
                                                className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
                                            >
                                                <Camera className="w-5 h-5" />
                                            </label>
                                            <input
                                                id="photo-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                disabled={isLoading}
                                                className="hidden"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h2 className="text-2xl font-medium mb-2 flex items-center justify-center gap-2 flex-wrap">
                                                {firstName && lastName ? `${firstName} ${lastName}` : firstName || "User"}
                                                {(customer?.metadata?.isPremium || isProConfirmed) && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                                        <Crown className="w-3.5 h-3.5 mr-1" />
                                                        Pro
                                                    </span>
                                                )}
                                            </h2>
                                            <p className="text-gray-600 mb-4">{email}</p>
                                            <p className="text-sm text-gray-500">
                                                Click the camera icon to update your profile photo
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription Card */}
                                <div className="bg-white rounded-3xl border border-gray-200 p-8">
                                    <h3 className="text-xl font-medium mb-4">Subscription</h3>
                                    
                                    {/* Pro Subscription Section */}
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Crown className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-lg">Pro Subscription</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {(customer?.metadata?.isPremium || isProConfirmed)
                                                            ? 'You have an active Pro subscription' 
                                                            : 'Upgrade to Pro for unlimited access'}
                                                    </p>
                                                </div>
                                                {(customer?.metadata?.isPremium || isProConfirmed) && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        <PiCheckCircle className="h-3 w-3 mr-1" />
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {!(customer?.metadata?.isPremium || isProConfirmed) && (
                                                <button
                                                    onClick={handleUpgradeToPro}
                                                    disabled={isUpgrading}
                                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-full font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Crown className="h-4 w-4" />
                                                    {isUpgrading ? "Processing..." : "Upgrade to Pro"}
                                                </button>
                                            )}
                                            
                                            {(customer?.metadata?.isPremium || isProConfirmed) && customer?.metadata?.subscriptionId && (
                                                <button
                                                    onClick={() => {
                                                        // Handle manage subscription
                                                        alert('Subscription management coming soon');
                                                    }}
                                                    className="w-full border border-purple-300 bg-white hover:bg-purple-50 text-purple-700 px-6 py-2.5 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    Manage Subscription
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information Card */}
                            <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-6">
                                <h3 className="text-xl font-medium mb-6">Account Information</h3>
                                <div className="space-y-6">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                disabled={isLoading}
                                                className="w-full border border-gray-300 bg-white text-gray-800 py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                disabled={isLoading}
                                                className="w-full border border-gray-300 bg-white text-gray-800 py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {/* Username (shown on your public store instead of email when set) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                disabled={isLoading}
                                                placeholder="e.g. dan.doodle"
                                                className="w-full border border-gray-300 bg-white text-gray-800 py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 placeholder:text-gray-400"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Shown on your public store page instead of email when set
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                readOnly
                                                disabled
                                                className="w-full border border-gray-300 bg-gray-50 text-gray-600 py-3 pl-12 pr-4 rounded-xl cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Contact support to change your email address
                                        </p>
                                    </div>

                                    {/* Store Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teacher/Store Description
                                        </label>
                                        <textarea
                                            value={storeDescription}
                                            onChange={(e) => setStoreDescription(e.target.value)}
                                            disabled={isLoading}
                                            placeholder="Tell visitors about yourself and what you teach..."
                                            rows={4}
                                            className="w-full border border-gray-300 bg-white text-gray-800 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            This will appear at the top of your creator store page
                                        </p>
                                    </div>

                                    {/* Change Password Section */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <h4 className="text-lg font-medium mb-2">Change Password</h4>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Update your password to keep your account secure
                                        </p>
                                        <div className="space-y-4">
                                            {/* Current Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        placeholder="Enter current password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        disabled={isLoading}
                                                        className="w-full border border-gray-300 bg-white text-gray-800 py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                                    />
                                                </div>
                                            </div>

                                            {/* New Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        placeholder="Enter new password (min 8 characters)"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        disabled={isLoading}
                                                        className="w-full border border-gray-300 bg-white text-gray-800 py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                                    />
                                                </div>
                                            </div>

                                            {/* Confirm Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        placeholder="Confirm new password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        disabled={isLoading}
                                                        className="w-full border border-gray-300 bg-white text-gray-800 py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                                    />
                                                </div>
                                            </div>

                                            {/* Change Password Button */}
                                            {(currentPassword || newPassword || confirmPassword) && (
                                                <button
                                                    onClick={handlePasswordChange}
                                                    disabled={isLoading}
                                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isLoading ? "Changing Password..." : "Change Password"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button 
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
