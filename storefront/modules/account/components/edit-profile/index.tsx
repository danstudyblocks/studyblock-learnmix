"use client"

import React, { useEffect, useState } from "react"
import { useFormState } from "react-dom"

import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { uploadCustomerAvatar } from "@/lib/data/vendor"
import Image from "next/image"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const EditProfile: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);
  const [avatar, setAvatar] = useState<File | null>(null);
  //@ts-ignore
  const decodedAvatarUrl = decodeURIComponent(customer?.metadata?.avatar_url || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(decodedAvatarUrl);
  const [uploading, setUploading] = useState<boolean>(false);

  // Function to handle updating the name
  const updateCustomerName = async (_currentState: Record<string, unknown>, formData: FormData) => {
    const customer = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
    }

    try {
      // Placeholder for the actual name update logic
      // await updateCustomer(customer)
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  // Function to handle updating the email
  const updateCustomerEmail = async (_currentState: Record<string, unknown>, formData: FormData) => {
    const email = formData.get("email") as string

    try {
      // Placeholder for email update logic
      // await updateCustomer({ email })
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  // Function to handle updating the password
  const updateCustomerPassword = async (_currentState: Record<string, unknown>, formData: FormData) => {
    const oldPassword = formData.get("old_password") as string
    const newPassword = formData.get("new_password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    try {
      // Placeholder for password update logic
      // await updateCustomerPassword({ oldPassword, newPassword })
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

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

  // UseFormState hooks for each section (name, email, password)
  const [nameState, nameFormAction] = useFormState(updateCustomerName, {
    error: false,
    success: false,
  })
  const [emailState, emailFormAction] = useFormState(updateCustomerEmail, {
    error: false,
    success: false,
  })
  const [passwordState, passwordFormAction] = useFormState(updateCustomerPassword, {
    error: false,
    success: false,
  })

  // Clear the success state on reset
  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(nameState.success || emailState.success || passwordState.success)
  }, [nameState, emailState, passwordState])

  return (
    <>
      <section className="mt-[100px] pt-15">
        <div className="4xl:large-container grid grid-cols-12 gap-4 rounded-2xl bg-white p-4 max-4xl:mx-4 sm:gap-6 sm:p-10">
          <div className="col-span-12 flex items-center justify-between gap-4">
            <h4 className="heading-4">Edit Profile Information</h4>
          </div>

          {/* Profile Picture Section */}
          <div className="col-span-12 flex items-center justify-start gap-4">
            <div className="max-md:overflow-hidden">
              {
                avatarUrl ? 
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    width={105}
                    height={105}
                    className="object-cover rounded-full"
                  /> :
                  <div className="w-[105px] h-[105px] rounded-full bg-b300 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {customer?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
              }
            </div>
            <div className="">
              <label className="cursor-pointer rounded-xl bg-n900 px-5 py-2 text-white" htmlFor="profilePic">
                Change
              </label>
              <input type="file" className="hidden rounded-lg" id="profilePic" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </div>

          {/* Name Input */}
          <form action={nameFormAction} className="col-span-12 sm:col-span-6">
            <p className="pb-3 font-medium text-n100">Name:</p>
            <input
              type="text"
              placeholder="Jhon Dhoe"
              name="first_name"
              defaultValue={customer.first_name || ""}
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
            <input
              type="text"
              placeholder="Doe"
              name="last_name"
              defaultValue={customer.last_name || ''}
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
          </form>

          {/* Email Input */}
          <form action={emailFormAction} className="col-span-12 sm:col-span-6">
            <p className="pb-3 font-medium text-n100">Email:</p>
            <input
              type="email"
              placeholder="example@mail.com"
              name="email"
              defaultValue={customer.email}
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
          </form>

          {/* Password Update Section */}
          <form action={passwordFormAction} className="col-span-12 sm:col-span-6">
            <div className="col-span-12 pb-6">
              <h5 className="heading-5">Update Password</h5>
            </div>
            <p className="pb-3 font-medium text-n100">Current Password*</p>
            <input
              type="password"
              name="old_password"
              placeholder="Enter Old Password"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
            <p className="pb-3 font-medium text-n100">Enter New Password*</p>
            <input
              type="password"
              name="new_password"
              placeholder="Enter New Password"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
            <p className="pb-3 font-medium text-n100">Confirm New Password*</p>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm New Password"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
          </form>

          {/* Save Changes Button */}
          <div className="col-span-12">
            <button
              className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8"
            >
              <span className="relative z-10">Save Changes</span>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default EditProfile
