import Link from "next/link";
import { PiPencilSimpleLine } from "react-icons/pi";
import { notFound } from "next/navigation";
import { getCustomer } from "@lib/data/customer";
import { listOrders } from "@lib/data/orders";

export default async function ProfilePage() {
  const customer = await getCustomer().catch(() => null);
  const orders = (await listOrders().catch(() => null)) || null;

  if (!customer) {
    notFound();
  }

  return (
    <section className="mt-[100px] pt-15">
      <div className="4xl:large-container grid grid-cols-12 gap-4 rounded-2xl bg-white p-4 max-4xl:mx-4 sm:gap-6 sm:p-10">
        <div className="col-span-12 flex items-center justify-between gap-4">
          <h4 className="heading-4">Profile Information</h4>
          <Link
            href={"/dashboard/edit-profile"}
            className="flex items-center justify-start gap-3 text-lg font-medium text-b300"
          >
            <span className="text-2xl">
              <PiPencilSimpleLine />
            </span>
            Edit Profile
          </Link>
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Name:</p>
          <input
            type="text"
            defaultValue={`${customer.first_name || ""} ${customer.last_name || ""}`}
            placeholder="John Doe"
            className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
          />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Area:</p>
          <input
            type="text"
            defaultValue={customer.addresses[0]?.city || ""}
            placeholder="New York"
            className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
          />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Email:</p>
          <input
            type="text"
            defaultValue={customer.email}
            placeholder="example@mail.com"
            className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
          />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Post Code:</p>
          <input
            type="text"
            defaultValue={customer.addresses[0]?.postal_code || ""}
            placeholder="1234"
            className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
          />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Phone:</p>
          <input
            type="text"
            defaultValue={customer.phone || ""}
            placeholder="+1234567"
            className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
          />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Address:</p>
          <input
            type="text"
            defaultValue={`${customer.addresses[0]?.address_1 || ""} ${customer.addresses[0]?.address_2 || ""}`}
            placeholder="3517 W. Gray St. Utica, Pennsylvania"
            className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
          />
        </div>
        <div className="col-span-12">
          <p className="pb-3 font-medium text-n100">About:</p>
          <textarea
            // defaultValue={customer.metadata?.about || ""}
            placeholder="We understand that every space is unique, which is why we tailor our cleaning services to meet the specific needs and preferences of each client. Our team of experienced and trained cleaners uses industry-leading techniques, equipment, and eco-friendly products to deliver superior results while minimizing environmental impact."
            className="min-h-40 w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
          ></textarea>
        </div>
      </div>
    </section>
  );
}
