"use client"

import React, { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"

type ProfileNameProps = {
  customer: HttpTypes.StoreCustomer
}

// Define the update function outside the component
const updateCustomerName = async (_currentState: any, formData: FormData) => {
  const customer = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
  }

  try {
    await updateCustomer(customer)
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export const ProfileName: React.FC<ProfileNameProps> = ({ customer }) => {
  const [state, formAction] = useFormState(updateCustomerName, {
    success: false,
    error: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle success/error notifications
  useEffect(() => {
    if (state.success) {
      // Show success notification if needed
    }
    if (state.error) {
      // Show error notification if needed
      console.error("Error updating profile:", state.error)
    }
  }, [state])

  return (
    <form action={formAction} className="col-span-12 sm:col-span-6">
      <p className="pb-3 font-medium text-n100">Name:</p>
      <input
        type="text"
        placeholder="John"
        name="first_name"
        defaultValue={customer.first_name || ""}
        className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800 mb-3"
      />
      <input
        type="text"
        placeholder="Doe"
        name="last_name"
        defaultValue={customer.last_name || ""}
        className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800 mb-3"
      />
      
      {/* Add submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8"
      >
        <span className="relative z-10">
          {isSubmitting ? "Updating..." : "Update Name"}
        </span>
      </button>

      {/* Show success/error messages */}
      {state.success && (
        <p className="mt-2 text-green-600">Name updated successfully!</p>
      )}
      {state.error && (
        <p className="mt-2 text-red-600">{state.error}</p>
      )}
    </form>
  )
}