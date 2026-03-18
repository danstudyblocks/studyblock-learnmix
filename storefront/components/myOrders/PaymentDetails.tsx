import { PiFilePdf } from "react-icons/pi";
import { Button } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { HttpTypes } from "@medusajs/types";

interface PaymentDetailsProps {
    orders: HttpTypes.StoreOrder[];
}

function PaymentDetails({ orders }: PaymentDetailsProps) {
    if (!orders?.length) {
        return (
            <section className="mt-[100px] pt-15">
                <div className="4xl:large-container grid grid-cols-12 gap-6 overflow-hidden rounded-2xl bg-white p-4 max-4xl:mx-4 sm:p-10">
                    <div className="col-span-12 flex flex-col items-center gap-y-4">
                        <h2 className="text-large-semi">Nothing to see here</h2>
                        <p className="text-base-regular">
                            You do not have any orders yet, let us change that :
                        </p>
                        <div className="mt-4">
                            <LocalizedClientLink href="/" passHref>
                                <Button>Continue shopping</Button>
                            </LocalizedClientLink>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="mt-[100px] pt-15">
            <div className="4xl:large-container grid grid-cols-12 gap-6 overflow-hidden rounded-2xl bg-white p-4 max-4xl:mx-4 sm:p-10">
                <div className="col-span-12 flex items-center justify-between gap-4">
                    <h4 className="heading-4">My Orders</h4>
                    <p className="text-lg font-medium text-b300">
                        Showing {orders.length} orders
                    </p>
                </div>
                <div className="relative col-span-12 h-px">
                    <div className="line-horizontal absolute left-0 top-0 h-full w-full"></div>
                </div>
                <div className="col-span-12 rounded-2xl bg-white px-6 py-6 max-lg:overflow-x-auto">
                    <table className="w-full text-nowrap">
                        <thead>
                            <tr className="w-full bg-n20 py-4 text-center text-lg font-semibold">
                                <th className="py-4">Order ID</th>
                                <th className="py-4">Status</th>
                                <th className="py-4">Date</th>
                                <th className="py-4">Amount</th>
                                <th className="py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-center font-medium text-n300">
                            {orders.map((order, idx) => (
                                <tr key={order.id} className={`w-full ${idx % 2 !== 0 && "bg-n20"}`}>
                                    <td className="px-6 py-4">#{order.display_id}</td>
                                    <td className="px-6 py-4">{order?.payment_status}</td>
                                    <td className="px-6 py-4">
                                        {new Date(order.created_at).toDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: order.currency_code
                                        }).format(order.total)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <LocalizedClientLink
                                                href={`/order/confirmed/${order.id}`}

                                                className="flex items-center gap-2"
                                            >
                                                <span className="rounded-lg bg-n20 p-2 text-lg !leading-none text-b300">
                                                    <PiFilePdf />
                                                </span>
                                                <p>View Details</p>
                                            </LocalizedClientLink>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default PaymentDetails;