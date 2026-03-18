import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getCustomer } from "@lib/data/customer";
import { redirect } from "next/navigation";
import React from "react";
import { signout } from "@lib/data/customer"


export default async function Layout({ children }: { children: React.ReactNode }) {
  const customer = await getCustomer().catch(() => null);

  if (!customer) {
    redirect("/sign-in");
  }

  return (
    <main className="bg-n20 pb-10">
      <DashboardHeader signout={signout} customer={customer} />
      {children}
    </main>
  );
}
