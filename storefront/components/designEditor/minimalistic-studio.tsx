"use client"
import EditorLoading from "@/components/editor/EditorLoading"
import dynamic from "next/dynamic"

// Dynamically import the MinimalisticDesignEdit with no SSR
const MinimalisticDesignEdit = dynamic(() => import("@/components/editor/MinimalisticDesignEdit"), {
    ssr: false,
    loading: () => <EditorLoading />,
})

export default function MinimalisticStudio({ customer }: any ) {
    return (
        <>
            <MinimalisticDesignEdit customer={customer} />
        </>
    )
}
