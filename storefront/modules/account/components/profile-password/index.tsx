"use client"

import React from "react"
import { useFormState } from "react-dom"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"

type ProfilePasswordProps = {
  customer: HttpTypes.StoreCustomer
}

export const ProfilePassword: React.FC<ProfilePasswordProps> = ({ customer }) => {
  const [state, formAction] = useFormState(updateCustomerPassword, {
    success: false,
    error: null,
  })

  async function updateCustomerPassword(_currentState: any, formData: FormData) {
    const oldPassword = formData.get("old_password") as string
    const newPassword = formData.get("new_password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    try {
      //@ts-ignore
      await updateCustomer({ ...customer , password: newPassword, old_password: oldPassword })
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  return (
    <form action={formAction} className="col-span-12 sm:col-span-6">
      <div className="col-span-12 pb-6">
        <h5 className="heading-5">Update Password</h5>
      </div>
      <p className="pb-3 font-medium text-n100">Current Password*</p>
      <input
        type="password"
        name="old_password"
        placeholder="Enter Old Password"
        className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800 mb-3"
      />
      <p className="pb-3 font-medium text-n100">Enter New Password*</p>
      <input
        type="password"
        name="new_password"
        placeholder="Enter New Password"
        className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800 mb-3"
      />
      <p className="pb-3 font-medium text-n100">Confirm New Password*</p>
      <input
        type="password"
        name="confirm_password"
        placeholder="Confirm New Password"
        className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
      />
    </form>
  )
}