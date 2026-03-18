"use client"

import dynamic from "next/dynamic"
import EditorLoading from "@/components/editor/EditorLoading"

const SimpleDesignEdit = dynamic(
  () =>
    import("@/components/editor/SimpleDesignEdit").then(
      (module) => module.SimpleDesignEdit
    ),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)

export default function SimpleStudio({ customer }: any) {
  return <SimpleDesignEdit customer={customer} />
}
