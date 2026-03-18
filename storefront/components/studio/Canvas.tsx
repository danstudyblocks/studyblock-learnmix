import { useState, useEffect } from "react"
import { reaction } from "mobx"

import { ZoomButtons } from "polotno/toolbar/zoom-buttons"
import { observer } from "mobx-react-lite"
import { WorkspaceWrap } from "polotno"
import { Workspace } from "polotno/canvas/workspace"
import { createStore } from "polotno/model/store"
import CanvasContextToolbar from "./CanvasContextToolbar"

interface CanvasProps {
  onTextFormattingToggle: (isOpen: boolean) => void
  onElementEditingToggle: (isOpen: boolean) => void
  onElementTypeSelect: (elementType: "text" | "graphic" | null) => void
  addTextTrigger?: { type: "heading" | "body"; timestamp: number } | null
  zoom: number
  fitToScreen: boolean
  tool: string
  isMobile?: boolean
  isTablet?: boolean
  onAddCanvas?: () => void
  onDeleteCanvas?: (canvasId: string) => void
}

interface CanvasElement {
  id: string
  type: "text" | "graphic"
  x: number
  y: number
  width: number
  height: number
  content?: string
  textType?: "heading" | "body"
  graphicType?: "rectangle" | "circle" | "star" | "triangle" | "image"
  color?: string
  fontSize?: number
  lineHeight?: number
}

interface CanvasData {
  id: string
  name: string
  elements: CanvasElement[]
  width: number
  height: number
}

// A4 size at 72 DPI: 595 x 842 pixels (portrait)
const defaultCanvasSize = { width: 595, height: 842 }

// Demo elements for showcasing the canvas functionality
const createDemoElements = (): CanvasElement[] => [
  {
    id: "demo-text-1",
    type: "text",
    x: 50,
    y: 50,
    width: 300,
    height: 60,
    content: "Welcome to LearnMix",
    textType: "heading",
    fontSize: 32,
    lineHeight: 1.2,
    color: "#1f2937",
  },
  {
    id: "demo-text-2",
    type: "text",
    x: 50,
    y: 130,
    width: 400,
    height: 40,
    content:
      "Click to select, drag to move, resize with handles, double-click to edit.",
    textType: "body",
    fontSize: 16,
    lineHeight: 1.4,
    color: "#374151",
  },
  {
    id: "demo-rectangle-1",
    type: "graphic",
    x: 80,
    y: 200,
    width: 120,
    height: 80,
    graphicType: "rectangle",
    color: "#3b82f6",
  },
  {
    id: "demo-circle-1",
    type: "graphic",
    x: 230,
    y: 200,
    width: 80,
    height: 80,
    graphicType: "circle",
    color: "#10b981",
  },
  {
    id: "demo-star-1",
    type: "graphic",
    x: 340,
    y: 200,
    width: 80,
    height: 80,
    graphicType: "star",
    color: "#f59e0b",
  },
  {
    id: "demo-triangle-1",
    type: "graphic",
    x: 450,
    y: 200,
    width: 80,
    height: 80,
    graphicType: "triangle",
    color: "#ef4444",
  },
  {
    id: "demo-rectangle-2",
    type: "graphic",
    x: 100,
    y: 320,
    width: 200,
    height: 60,
    graphicType: "rectangle",
    color: "#8b5cf6",
  },
  {
    id: "demo-circle-2",
    type: "graphic",
    x: 350,
    y: 320,
    width: 100,
    height: 100,
    graphicType: "circle",
    color: "#06b6d4",
  },
  {
    id: "demo-text-3",
    type: "text",
    x: 50,
    y: 450,
    width: 500,
    height: 40,
    content: "Try using the tools above to add more elements to your canvas!",
    textType: "body",
    fontSize: 16,
    lineHeight: 1.5,
    color: "#6b7280",
  },
]

export const Canvas = observer(
  ({
    onTextFormattingToggle,
    onElementEditingToggle,
    onElementTypeSelect,
    addTextTrigger,
    zoom,
    fitToScreen,
    tool,
    isMobile = false,
    isTablet = false,
    onAddCanvas,
    onDeleteCanvas,
  }: CanvasProps) => {
    // Create a store for Polotno
    const [store] = useState(() => {
      // Initialize with a default page
      const store = createStore({
        key: process.env.NEXT_PUBLIC_POLOTNO_API_KEY || "",
        showCredit: false,
      })
      const page = store.addPage()
      return store
    })

    useEffect(() => {
      const dispose = reaction(
        () => store.selectedElements.map((element: any) => element.type).join("|"),
        () => {
          const activeElement = store.selectedElements[0]
          onElementTypeSelect(
            activeElement ? (activeElement.type === "text" ? "text" : "graphic") : null
          )
          onTextFormattingToggle(false)
          onElementEditingToggle(false)
        },
        { fireImmediately: true }
      )

      return () => dispose()
    }, [
      onElementEditingToggle,
      onElementTypeSelect,
      onTextFormattingToggle,
      store,
    ])

    // Handle add text trigger from toolbar
    useEffect(() => {
      if (addTextTrigger) {
        const page = store.pages[0]
        if (page) {
          const element = page.addElement({
            type: "text",
            x: 100,
            y: 100,
            width: 200,
            height: addTextTrigger.type === "heading" ? 60 : 40,
            text:
              addTextTrigger.type === "heading"
                ? "Heading Text"
                : "Body text goes here",
            fontSize: addTextTrigger.type === "heading" ? 32 : 16,
            fontFamily: "Arial",
            fill: "#000000",
          })

          // Select the new element
          store.selectElements([element.id])
          onElementTypeSelect("text")
        }
      }
    }, [addTextTrigger, store, onElementTypeSelect])

    return (
      <>
        <WorkspaceWrap>
          <CanvasContextToolbar store={store} />

          <div className="flex-grow relative border-t border-slate-200">
            <Workspace store={store} backgroundColor="#F5F5F5" />
          </div>

          <div className="hover:shadow-lg bg-gray-50 px-5">
            <ZoomButtons store={store} />
          </div>
        </WorkspaceWrap>
      </>
    )
  }
)
