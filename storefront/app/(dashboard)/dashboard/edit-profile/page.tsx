import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { getCustomer } from "@/lib/data/customer"
import {ProfileName} from "@/modules/account/components/profile-name"
import {ProfileEmail} from "@/modules/account/components/profile-email"
import { ProfileAvatar } from "@/modules/account/components/change-avatar"
import { ProfilePassword } from "@/modules/account/components/profile-password"

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "View and edit your profile information.",
}

export default async function EditProfile() {
  const customer = await getCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <section className="mt-[100px] pt-15">
      <div className="4xl:large-container grid grid-cols-12 gap-4 rounded-2xl bg-white p-4 max-4xl:mx-4 sm:gap-6 sm:p-10">
        <div className="col-span-12 flex items-center justify-between gap-4">
          <h4 className="heading-4">Edit Profile Information</h4>
        </div>

        <ProfileAvatar customer={customer} />
        <ProfileName customer={customer} />
        <ProfileEmail customer={customer} />
      </div>
    </section>
  )
}