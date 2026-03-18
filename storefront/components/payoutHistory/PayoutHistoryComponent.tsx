"use client"
import { PiFilePdf, PiDownloadSimple, PiCalendar, PiCurrencyDollar, PiCheckCircle, PiWarningCircle, PiXCircle, PiHouse, PiArrowLeft } from "react-icons/pi";
import Pagination from "@/components/ui/Pagination";
import VendorPaymentForm from "@/components/vendorPaymentForm/VendorPaymentForm";
import { getPayoutHistory, type Payout } from '@/lib/data/stripe-connect';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function PayoutHistoryComponent({ customer }: any) {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPayouts();
    }, [customer?.id]);

    const fetchPayouts = async () => {
        try {
            console.log('🔍 Fetching payout history...');
            const { success, payouts, error } = await getPayoutHistory();
            
            console.log('📊 API Response:', { success, payouts, error });
            
            if (success) {
                console.log('✅ Payouts received:', payouts);
                console.log('📋 Number of payouts:', payouts?.length || 0);
                
                // Log each payout structure
                if (payouts && payouts.length > 0) {
                    console.log('🔍 First payout structure:', payouts[0]);
                    console.log('🔍 All payout statuses:', payouts.map(p => ({ id: p.id, status: p.status })));
                }
                
                setPayouts(payouts || []);
            } else {
                console.error('❌ Failed to fetch payouts:', error);
                setError(error || 'Failed to fetch payouts');
            }
        } catch (err) {
            console.error('💥 Error in fetchPayouts:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusIcon = (status: string | undefined | null) => {
        console.log('🎨 getStatusIcon called with status:', status, 'type:', typeof status);
        
        if (!status) {
            console.log('⚠️ Status is falsy, returning default icon');
            return <PiWarningCircle className="h-4 w-4 text-gray-600" />;
        }
        
        const lowerStatus = status.toLowerCase();
        console.log('🔄 Status after toLowerCase:', lowerStatus);
        
        switch (lowerStatus) {
            case 'paid':
                return <PiCheckCircle className="h-4 w-4 text-green-600" />;
            case 'pending':
                return <PiWarningCircle className="h-4 w-4 text-yellow-600" />;
            case 'failed':
                return <PiXCircle className="h-4 w-4 text-red-600" />;
            default:
                console.log('❓ Unknown status, returning default icon');
                return <PiWarningCircle className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string | undefined | null) => {
        console.log('🎨 getStatusColor called with status:', status, 'type:', typeof status);
        
        if (!status) {
            console.log('⚠️ Status is falsy, returning default color');
            return 'bg-gray-100 text-gray-800';
        }
        
        const lowerStatus = status.toLowerCase();
        console.log('🔄 Status after toLowerCase:', lowerStatus);
        
        switch (lowerStatus) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                console.log('❓ Unknown status, returning default color');
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <section className="mt-[100px] pt-15">
            {/* <VendorPaymentForm customer={customer} /> */}
            <div className="4xl:large-container grid grid-cols-12 gap-6 overflow-hidden rounded-2xl bg-white p-4 max-4xl:mx-4 sm:p-10">
                <div className="col-span-12 flex items-center justify-between gap-4">
                    <h4 className="heading-4">Payout History</h4>
                    <p className="text-lg font-medium text-b300">
                        {loading ? 'Loading...' : `Showing ${payouts.length} payout${payouts.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <div className="relative col-span-12 h-px">
                    <div className="line-horizontal absolute left-0 top-0 h-full w-full"></div>
                </div>

                {loading ? (
                    <div className="col-span-12 flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="col-span-12 text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-8 mb-6 border border-red-200">
                                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                                    <PiXCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Unable to Load Payout History
                                </h3>
                                
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-start">
                                        <PiWarningCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => {
                                            setError(null);
                                            setLoading(true);
                                            fetchPayouts();
                                        }}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <PiCheckCircle className="h-4 w-4" />
                                        Try Again
                                    </button>
                                    
                                    <Link
                                        href="/dashboard/home"
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <PiHouse className="h-4 w-4" />
                                        Go to Dashboard
                                        <PiArrowLeft className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : payouts.length === 0 ? (
                    <div className="col-span-12 text-center py-12">
                        <PiCurrencyDollar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg">No payouts yet</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Payouts will appear here once you start selling
                        </p>
                    </div>
                ) : (
                    <div className="col-span-12 rounded-2xl bg-white px-6 py-6 max-lg:overflow-x-auto">
                        <table className="w-full text-nowrap">
                            <thead>
                                <tr className="w-full bg-n20 py-4 text-center text-lg font-semibold">
                                    <th className="py-4">Ref ID</th>
                                    <th className="py-4">Date</th>
                                    <th className="py-4">Amount</th>
                                    <th className="py-4">Status</th>
                                    <th className="py-4">Downloads</th>
                                </tr>
                            </thead>
                            <tbody className="text-center font-medium text-n300">
                                {payouts.map((payout, idx) => {
                                    console.log(`🎯 Rendering payout ${idx + 1}:`, {
                                        id: payout.id,
                                        status: payout.status,
                                        amount: payout.amount,
                                        currency_code: payout.currency_code,
                                        created_at: payout.created_at,
                                        data: payout.data
                                    });
                                    
                                    return (
                                        <tr key={payout.id} className={`w-full ${idx % 2 !== 0 && "bg-n20"}`}>
                                            <td className="px-6 py-4">{payout.data?.id || payout.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <PiCalendar className="h-4 w-4 text-gray-400" />
                                                    {formatDate(payout.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold">
                                                {formatAmount(payout.amount, payout.currency_code)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {getStatusIcon(payout.status)}
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                                                        {payout.status || 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                                                        <PiFilePdf className="h-4 w-4" />
                                                        <PiDownloadSimple className="h-4 w-4" />
                                                        <span className="text-sm">PDF</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {payouts.length > 0 && (
                    <div className="col-span-12">
                        <Pagination 
                            currentPage={1}
                            totalPages={1}
                            onPageChange={() => {}}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

export default PayoutHistoryComponent;
