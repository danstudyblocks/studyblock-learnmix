import React from 'react';
import Link from 'next/link';

export default function SubscriptionCancelPage() {
    return (
        <div className="max-w-lg mx-auto mt-16 p-6 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Subscription Canceled</h1>
            <p className="mb-6">
                Your subscription process was canceled. No charges have been made.
            </p>
            <p className="mb-8">
                If you have any questions or need assistance, please do not hesitate to contact our support team.
            </p>
            <div className="flex justify-center space-x-4">
                <Link href="/pricing" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Back to Pricing
                </Link>
                <Link href="/contact" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                    Contact Support
                </Link>
            </div>
        </div>
    );
}