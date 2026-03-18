"use client"

import React from "react"
import { useFormState } from "react-dom"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"

type ProfileEmailProps = {
  customer: HttpTypes.StoreCustomer
}

export const ProfileEmail: React.FC<ProfileEmailProps> = ({ customer }) => {
  const [state, formAction] = useFormState(updateCustomerEmail, {
    success: false,
    error: null,
  })

  async function updateCustomerEmail(_currentState: any, formData: FormData) {
    const email = formData.get("email") as string

    try {
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  return (
    <form action={formAction} className="col-span-12 sm:col-span-6">
      <p className="pb-3 font-medium text-n100">Email:</p>
      <input
        type="email"
        placeholder="example@mail.com"
        name="email"
        defaultValue={customer.email}
        className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
      />
    </form>
  )
}