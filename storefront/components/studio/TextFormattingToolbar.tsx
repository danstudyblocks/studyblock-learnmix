import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import {
//   Bold,
//   Italic,
//   Underline,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
//   Minus,
//   Plus,
//   Type,
//   ChevronDown,
//   X,
// } from "lucide-react"

import { TextSection } from "polotno/side-panel"

interface TextFormattingToolbarProps {
  isOpen: boolean
  onClose: () => void
  onAddText?: (textType: "heading" | "body") => void
  isMobile?: boolean
  screenSize?: "mobile" | "tablet" | "desktop"
  store?: any
}

export function TextFormattingToolbar({
  isOpen,
  // onClose,
  // onAddText,
  // isMobile = false,
  // screenSize = "desktop",
  store,
}: TextFormattingToolbarProps) {
  // const [font, setFont] = useState("Inter")
  // const [fontSize, setFontSize] = useState(16)
  // const [lineHeight, setLineHeight] = useState(1.4)
  // const [, setAlignment] = useState("left")
  // const [isBold, setIsBold] = useState(false)
  // const [isItalic, setIsItalic] = useState(false)
  // const [isUnderline, setIsUnderline] = useState(false)
  // const [isAddTextDropdownOpen, setIsAddTextDropdownOpen] = useState(false)

  // const fonts = [
  //   "Inter",
  //   "Arial",
  //   "Helvetica",
  //   "Times New Roman",
  //   "Georgia",
  //   "Roboto",
  //   "Open Sans",
  //   "Lato",
  //   "Montserrat",
  //   "Source Sans Pro",
  // ]

  // const lineHeights = [
  //   0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8,
  //   3.0,
  // ]

  // const handleFontSizeChange = (increment: number) => {
  //   const newSize = Math.max(8, Math.min(72, fontSize + increment))
  //   setFontSize(newSize)
  // }

  // const handleLineHeightChange = (increment: number) => {
  //   const newLineHeight = Math.max(0.8, Math.min(3.0, lineHeight + increment))
  //   setLineHeight(Math.round(newLineHeight * 10) / 10) // Round to 1 decimal place
  // }

  // const handleAlignmentClick = (newAlignment: string) => {
  //   setAlignment(newAlignment)
  // }

  // const handleAddText = (textType: "heading" | "body") => {
  //   if (onAddText) {
  //     onAddText(textType)
  //   }
  //   setIsAddTextDropdownOpen(false)
  // }

  if (!isOpen) return null

  return (
    <div className="overflow-y-auto h-full ">
      <TextSection.Panel store={store} />
    </div>
  )
}
