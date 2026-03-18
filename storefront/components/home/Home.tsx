"use client"
import Counter from "@/components/ui/NumberCounter2";
import StripeConnectSetup from "@/components/stripe-connect/StripeConnectSetup";
import { getPayoutAccount, createPayoutAccount, startOnboarding } from "@/lib/data/stripe-connect";
import Link from "next/link";
import {
    dashboardTodolist,
    orderInfo,
} from "@/data/data";
import { getLinkedCreatorOrders, uploadCustomerAvatar } from "@/lib/data/vendor";
import OrderOverview from "@/modules/account/components/order-overview";
import people1 from "@/public/images/review_people_1.png";
import people2 from "@/public/images/review_people_2.png";
import people3 from "@/public/images/review_people_3.png";
import { HttpTypes } from "@medusajs/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
    PiCalendarPlusBold,
    PiCaretRight,
    PiEnvelopeSimpleBold,
    PiPencilSimpleLineBold,
    PiPhoneBold,
    PiPlusBold,
    PiCurrencyCircleDollar,
    PiHandshake,
    PiListChecks,
    PiCreditCard,
    PiCheckCircle,
    PiWarningCircle,
    PiArrowUpRight,
    PiGear,
    PiPlus
} from "react-icons/pi";
import { getBaseURL } from "@/lib/util/env";


function Home({ customer, orders }: { customer: HttpTypes.StoreCustomer | null, orders: HttpTypes.StoreOrder[] }) {
    const [orderInfo, setOrderInfo] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [avatar, setAvatar] = useState<File | null>(null);
    //@ts-ignore
    const decodedAvatarUrl = decodeURIComponent(customer?.metadata?.avatar_url || "");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(decodedAvatarUrl);
    const [uploading, setUploading] = useState<boolean>(false);
    const [stripeStatus, setStripeStatus] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isStartingOnboarding, setIsStartingOnboarding] = useState(false);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { success, orders, error } = await getLinkedCreatorOrders(customer?.id);
                if (success) setOrderInfo(orders);
                else console.error(error);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchStripeStatus = async () => {
            try {
                const { success, payout_account } = await getPayoutAccount();
                if (success && payout_account) {
                    // Handle nested structure
                    const actualPayoutAccount = (payout_account as any).payout_account || payout_account;
                    setStripeStatus(actualPayoutAccount.status);
                    
                    // Auto-sync status if account exists but is not active
                    if (actualPayoutAccount.status !== 'active') {
                        await syncStripeStatus();
                    }
                }
            } catch (error) {
                console.error("Error fetching Stripe status:", error);
            }
        };

        const syncStripeStatus = async () => {
            try {
                // Re-fetch the payout account to get updated status
                const { success, payout_account } = await getPayoutAccount();
                if (success && payout_account) {
                    const actualPayoutAccount = (payout_account as any).payout_account || payout_account;
                    setStripeStatus(actualPayoutAccount.status);
                }
            } catch (error) {
                console.error("Error syncing Stripe status:", error);
            }
        };

        if (customer?.id) {
            fetchOrders();
            fetchStripeStatus();
        }
    }, [customer?.id]);

    useEffect(() => {
        const avatarUrl = customer?.metadata?.avatar_url
        //@ts-ignore
        setAvatarUrl(avatarUrl)
    }, [customer])


    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAvatar(e.target.files[0]);
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatar) return; // If no avatar is selected, do nothing

        setUploading(true); // Set uploading state to true

        const formData = new FormData();
        formData.append("files", avatar); // Add avatar image to FormData

        try {
            const { success, avatar_url, error } = await uploadCustomerAvatar(formData);
            if (success) {
                setAvatarUrl(avatar_url); // Update the avatar URL
            } else {
                console.error("Error uploading avatar:", error);
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
        } finally {
            setUploading(false); // Reset uploading state
        }
    };

    const handleCreatePayoutAccount = async () => {
        setIsCreating(true);
        try {
            const requestData = {
                context: {
                    type: 'express' as const,
                    email: customer?.email || '',
                }
            };
            
            const { success, payout_account, error } = await createPayoutAccount(requestData);

            if (success && payout_account) {
                // Handle nested structure
                const actualPayoutAccount = (payout_account as any).payout_account || payout_account;
                setStripeStatus(actualPayoutAccount.status);
            } else {
                console.error('Failed to create payout account:', error);
            }
        } catch (err) {
            console.error('Error creating payout account:', err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleStartOnboarding = async () => {
        setIsStartingOnboarding(true);
        try {
            const requestData = { 
                context: {
                    refresh_url: `${getBaseURL()}/dashboard/home`,
                    return_url: `${getBaseURL()}/dashboard/home`
                }
            };
            
            const { success, payout_account, error } = await startOnboarding(requestData);

            if (success && payout_account) {
                const onboardingUrl = payout_account.data?.onboarding_url || 
                                    (payout_account as any).onboarding?.data?.onboarding_url;
                
                if (onboardingUrl) {
                    window.open(onboardingUrl, '_blank');
                }
            } else {
                console.error('Failed to start onboarding:', error);
            }
        } catch (err) {
            console.error('Error starting onboarding:', err);
        } finally {
            setIsStartingOnboarding(false);
        }
    };

    return (
        <>
            <section className="mt-[100px]">
                <div className="4xl:large-container grid grid-cols-12 gap-6 max-4xl:container pt-15">
                    <div className="col-span-12 xxl:col-span-9">
                        <div className="sbp-15 flex w-full items-start justify-between gap-6 max-md:flex-col md:items-center md:gap-3">
                            <h3 className="heading-3">
                                Hi {customer ? `${customer.first_name} ${customer.last_name}` : "Guest"}!
                            </h3>
                        </div>

                        <div className="w-full rounded-2xl bg-white p-8">
                            <h4 className="heading-4">This Month Summary</h4>
                            <div className="grid grid-cols-12 gap-3 pt-6">
                                {/* Total Earnings Card */}
                                <div className="col-span-12 sm:col-span-6 xxl:col-span-3 rounded-2xl bg-b300 px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="flex items-center justify-center rounded-full bg-white p-3 text-2xl !leading-none">
                                                <PiHandshake />
                                            </div>
                                            <p className="text-lg font-medium text-white">Total Earnings</p>
                                        </div>

                                        <Link
                                            href="/dashboard/payout-history"
                                            className="-mr-4 -mt-4 flex items-center justify-center rounded-full border border-white p-3 !leading-none text-white"
                                        >
                                            <PiArrowUpRight />
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between pt-8">
                                        <div className="heading-3 text-white flex">
                                            $<Counter value={Number(customer?.metadata?.total_earnings || 0)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Total Orders Card */}
                                <div className="col-span-12 sm:col-span-6 xxl:col-span-3 rounded-2xl bg-o300 px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="flex items-center justify-center rounded-full bg-white p-3 text-2xl !leading-none">
                                                <PiListChecks />
                                            </div>
                                            <p className="text-lg font-medium text-white">Total Orders</p>
                                        </div>

                                        <Link
                                            href="/dashboard/payout-history"
                                            className="-mr-4 -mt-4 flex items-center justify-center rounded-full border border-white p-3 !leading-none text-white"
                                        >
                                            <PiArrowUpRight />
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between pt-8">
                                        <div className="heading-3 text-white flex">
                                            <Counter value={Number(customer?.metadata?.total_order_count || 0)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Available Balance Card */}
                                <div className="col-span-12 sm:col-span-6 xxl:col-span-3 rounded-2xl bg-g300 px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="flex items-center justify-center rounded-full bg-white p-3 text-2xl !leading-none">
                                                <PiCurrencyCircleDollar />
                                            </div>
                                            <p className="text-lg font-medium text-white">Available Balance</p>
                                        </div>

                                        <Link
                                            href="/dashboard/payout-history"
                                            className="-mr-4 -mt-4 flex items-center justify-center rounded-full border border-white p-3 !leading-none text-white"
                                        >
                                            <PiArrowUpRight />
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between pt-8">
                                        <div className="heading-3 text-white flex">
                                            $<Counter value={Number(customer?.metadata?.available_balance || 0)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Payout Status Card */}
                                <div className="col-span-12 sm:col-span-6 xxl:col-span-3 rounded-2xl bg-r300 px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="flex items-center justify-center rounded-full bg-white p-3 text-2xl !leading-none">
                                                <PiCreditCard />
                                            </div>
                                            <p className="text-lg font-medium text-white">Payout Status</p>
                                        </div>

                                        <Link
                                            href="/dashboard/payout-history"
                                            className="-mr-4 -mt-4 flex items-center justify-center rounded-full border border-white p-3 !leading-none text-white"
                                        >
                                            <PiArrowUpRight />
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between pt-8">
                                        <div className="text-white">
                                            {stripeStatus === 'active' ? (
                                                <div className="flex items-center gap-2">
                                                    <PiCheckCircle className="h-5 w-5 text-green-300" />
                                                    <span className="text-sm font-medium">Active</span>
                                                </div>
                                            ) : stripeStatus === 'pending' ? (
                                                <div className="flex items-center gap-2">
                                                    <PiWarningCircle className="h-5 w-5 text-yellow-300" />
                                                    <span className="text-sm font-medium">Pending</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <PiWarningCircle className="h-5 w-5 text-red-300" />
                                                    <span className="text-sm font-medium">Not Setup</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 xxl:col-span-3">
                        <div className="rounded-xl border bg-white p-8">
                            <div className="flex items-start justify-between">
                                <Link href={'/dashboard/edit-profile'} >
                                    <p className="rounded-full bg-b300 text-white px-2 py-1 text-sm font-medium">
                                        Edit
                                    </p>
                                </Link>
                            </div>

                            <div className="flex flex-col items-center justify-center py-3.5">
                                <div className="max-md:overflow-hidden">
                                    {
                                        avatarUrl ?
                                            <Image
                                                src={avatarUrl}
                                                alt="Avatar"
                                                width={138}
                                                height={138} // Same height as hexagon size
                                                className="object-cover rounded-full"
                                            /> :
                                            <div className="w-[138px] h-[138px] rounded-full bg-b300 flex items-center justify-center">
                                                <span className="text-white text-4xl font-bold">
                                                    {customer?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                    }
                                </div>

                                <div className="flex w-full flex-col items-center justify-center border-b border-b50 pb-6 pt-3">
                                    <div className="flex-col items-center justify-center gap-3">
                                        <h5 className="heading-5">{customer?.first_name} {customer?.last_name}</h5>
                                    </div>
                                    <p className="pt-2 text-n500">{customer?.email}</p>
                                    
                                    {/* Stripe Status */}
                                    <div className="mt-3">
                                        {stripeStatus ? (
                                            <div className="space-y-2">
                                                <Link 
                                                    href="/dashboard/home" 
                                                    className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <PiCreditCard className="h-4 w-4 text-gray-500" />
                                                    {stripeStatus === 'active' ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <PiCheckCircle className="h-3 w-3 mr-1" />
                                                            Stripe Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            <PiWarningCircle className="h-3 w-3 mr-1" />
                                                            Stripe {stripeStatus === 'pending' ? 'Pending' : 'Inactive'}
                                                        </span>
                                                    )}
                                                    <PiArrowUpRight className="h-3 w-3 text-gray-400" />
                                                </Link>
                                                
                                                {stripeStatus === 'pending' && (
                                                    <button
                                                        onClick={handleStartOnboarding}
                                                        disabled={isStartingOnboarding}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                                                    >
                                                        {isStartingOnboarding ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                                Starting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PiPlus className="h-3 w-3" />
                                                                Complete Onboarding
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleCreatePayoutAccount}
                                                disabled={isCreating}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                {isCreating ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                        Creating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <PiCreditCard className="h-3 w-3" />
                                                        Connect Stripe Account
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-3">
                                <div className="flex cursor-pointer items-center justify-center rounded-full bg-n20 p-3 !leading-none">
                                    <PiPencilSimpleLineBold />
                                </div>
                                <div className="flex cursor-pointer items-center justify-center rounded-full bg-n20 p-3 !leading-none">
                                    <PiEnvelopeSimpleBold />
                                </div>
                                <div className="flex cursor-pointer items-center justify-center rounded-full bg-n20 p-3 !leading-none">
                                    <PiPhoneBold />
                                </div>
                                <div className="flex cursor-pointer items-center justify-center rounded-full bg-n20 p-3 !leading-none">
                                    <PiPlusBold />
                                </div>
                                <div className="flex cursor-pointer items-center justify-center rounded-full bg-n20 p-3 !leading-none">
                                    <PiCalendarPlusBold />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="4xl:large-container grid grid-cols-12 gap-6 pt-6 max-4xl:container">
                    <div className="col-span-12 rounded-2xl bg-white px-6 py-8 max-sm:overflow-x-auto lg:col-span-8">
                        <table className="w-full text-nowrap">
                            <thead>
                                <tr className="w-full bg-n20 py-4 text-center text-lg font-semibold">
                                    <th className="py-4">Client Name</th>
                                    <th className="py-4">Status</th>
                                    <th className="py-4">Location</th>
                                    <th className="py-4">Price</th>
                                </tr>
                            </thead>
                            <tbody className="text-center font-medium text-n300">
                                {orderInfo.map(({ id, status, location, price, customer, shipping_address, payment_collections }) => (
                                    <tr className="w-full" key={id}>
                                        <td className="py-3">{customer.first_name || customer.last_name || customer.email}</td>
                                        <td className="">
                                            <div
                                                className={`rounded-full px-8 py-2 text-xs ${status === "Completed"
                                                    ? "text-v200 bg-v50/80"
                                                    : status === "Inprogress"
                                                        ? "bg-g50/80 text-g300"
                                                        : "text-r300 bg-r50/80"
                                                    }`}
                                            >
                                                {payment_collections[0].status || status}
                                            </div>
                                        </td>
                                        <td className="px-6">{shipping_address.address_1 || shipping_address.city || shipping_address.province}</td>
                                        <td>${payment_collections[0].authorized_amount || payment_collections[0].captured_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-span-12 rounded-2xl bg-white px-6 py-8 lg:col-span-4">
                        <div className="flex items-center justify-between pb-6">
                            <p className="heading-4">My recent orders</p>
                            <Link href={"/dashboard/my-orders"} >
                                <div className="bg flex cursor-pointer items-center justify-start gap-2 rounded-full border border-n40 bg-n10 px-4 py-2 text-sm font-medium text-n300">
                                    <p>See More</p>
                                    <PiCaretRight />
                                </div>
                            </Link>
                        </div>
                        <OrderOverview orders={orders} />
                    </div>
                </div>
            </section>


            {/* Stripe Connect Integration */}
            <section className="mt-8">
                <div className="4xl:large-container grid grid-cols-12 gap-6 max-4xl:container">
                    <div className="col-span-12">
                        <StripeConnectSetup customer={customer} />
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
