"use client"

import { useEffect, useMemo, useState } from "react"
import { Popover, Position, Tooltip } from "@blueprintjs/core"
import { Droplet } from "lucide-react"
import Sketch from "polotno/toolbar/sketch"
import {
  DEFAULT_COLORS,
  getUsedColors,
} from "polotno/toolbar/color-picker"
import {
  closeToolbarPopovers,
  TOOLBAR_CLOSE_POPOVERS_EVENT,
} from "./toolbarPopoverUtils"

function formatPickerColor(nextColor: any) {
  if (typeof nextColor === "string") {
    return nextColor
  }

  if (nextColor?.rgb) {
    const { r, g, b, a } = nextColor.rgb
    if (typeof a === "number" && a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`
    }
  }

  return nextColor?.hex || "#000000"
}

export default function TextColorMenuButton({
  elements,
  store,
}: {
  elements: any[]
  store: any
}) {
  const [isOpen, setIsOpen] = useState(false)

  const presetColors = useMemo(() => {
    return Array.from(new Set([...getUsedColors(store), ...DEFAULT_COLORS]))
  }, [store])

  useEffect(() => {
    const handleCloseAll = () => {
      setIsOpen(false)
    }

    document.addEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)

    return () => {
      document.removeEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)
    }
  }, [])

  return (
    <Popover
      isOpen={isOpen}
      onInteraction={(nextOpenState) => {
        setIsOpen(nextOpenState)
      }}
      position={Position.LEFT_TOP}
      content={
        <Sketch
          color={elements[0].fill}
          presetColors={presetColors}
          onChange={(nextColor: any) => {
            const color = formatPickerColor(nextColor)

            store.history.transaction(() => {
              elements.forEach((element) => {
                element.set({ fill: color })
              })
            })
          }}
        />
      }
    >
      <Tooltip content="Text color" position={Position.LEFT}>
        <button
          type="button"
          aria-label="Text color"
          aria-expanded={isOpen}
          className={`right-context-drawer__nav-button right-context-drawer__nav-button--tool${
            isOpen ? " right-context-drawer__nav-button--active" : ""
          }`}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            if (isOpen) {
              setIsOpen(false)
              return
            }

            closeToolbarPopovers(event.currentTarget)

            window.setTimeout(() => {
              setIsOpen(true)
            }, 0)
          }}
        >
          <span className="right-context-drawer__nav-icon">
            <Droplet className="h-5 w-5" />
          </span>
          <span className="right-context-drawer__nav-label">Colour</span>
        </button>
      </Tooltip>
    </Popover>
  )
}
