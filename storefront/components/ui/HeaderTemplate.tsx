"use client"
import { SquarePen } from "lucide-react"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import UserMenu from "../editor-page/UserMenu"

type HeaderTemplateProps = {
  customer: HttpTypes.StoreCustomer | null
}

function HeaderTemplate({ customer }: HeaderTemplateProps) {
  return (
    <header className="border-b ml-[2px] bg-[#FCFAF8] border-black/0 p-4">
      <div className="w-full">
        <div className="items-center flex justify-between gap-[12px]">
          <div className="items-center flex grow basis-[0%] gap-[16px]">
            <Link 
              href="/"
              className="items-center flex h-10 hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Go to homepage"
            >
              <div className="ml-auto mr-auto text-center">
                <span 
                  className="text-2xl font-light tracking-tight"
                  style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                >
                  learnmix
                </span>
              </div>
            </Link>
            
            <div className="flex justify-end w-full gap-2 items-center">
              <Link 
                href="/design-studio"
                className="items-center flex font-medium justify-center text-center whitespace-nowrap h-9 bg-white border border-black/20 text-black px-4 py-2 rounded-full hover:bg-gray-50 transition-colors text-[14px] gap-[8px] leading-[20px]"
              >
                <SquarePen className="w-4 h-4" />
                Editor
              </Link>
              
              <UserMenu customer={customer} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderTemplate
