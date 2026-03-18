"use client"
import EditorLoading from "@/components/editor/EditorLoading"
import dynamic from "next/dynamic"

// Dynamically import the DesignEdit with no SSR
const DesignEdit = dynamic(() => import("@/components/editor/DesignEdit"), {
    ssr: false,
    loading: () => <EditorLoading />,
})

export default function DesignStudio({ customer }: any ) {
    return (
        <>
            <DesignEdit customer={customer} />
        </>
    )
}
