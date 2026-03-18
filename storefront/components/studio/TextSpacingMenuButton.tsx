"use client"

import { useEffect, useState } from "react"
import { NumericInput, Popover, Position, Slider, Tooltip } from "@blueprintjs/core"
import { SlidersHorizontal } from "lucide-react"
import {
  closeToolbarPopovers,
  TOOLBAR_CLOSE_POPOVERS_EVENT,
} from "./toolbarPopoverUtils"

export default function TextSpacingMenuButton({
  elements,
  store,
}: {
  elements: any[]
  store: any
}) {
  const [isOpen, setIsOpen] = useState(false)
  const activeElement = elements[0]
  const lineHeight =
    typeof activeElement?.lineHeight === "number"
      ? Math.round(activeElement.lineHeight * 100)
      : 120
  const letterSpacing = Math.round((activeElement?.letterSpacing || 0) * 100)

  useEffect(() => {
    const handleCloseAll = () => setIsOpen(false)
    document.addEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)
    return () => {
      document.removeEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)
    }
  }, [])

  const updateTextSpacing = (nextValues: {
    lineHeight?: number
    letterSpacing?: number
  }) => {
    store.history.transaction(() => {
      elements.forEach((element) => {
        element.set(nextValues)
      })
    })
  }

  return (
    <Popover
      isOpen={isOpen}
      onInteraction={(nextOpenState) => setIsOpen(nextOpenState)}
      position={Position.LEFT_TOP}
      content={
        <div className="right-context-spacing-menu">
          <div className="right-context-spacing-menu__row">
            <span className="right-context-spacing-menu__label">Line height</span>
            <NumericInput
              value={lineHeight}
              onValueChange={(value) => {
                if (!Number.isNaN(value)) updateTextSpacing({ lineHeight: value / 100 })
              }}
              min={50}
              max={250}
              buttonPosition="none"
              className="right-context-spacing-menu__input"
            />
          </div>
          <Slider
            value={lineHeight}
            min={50}
            max={250}
            stepSize={1}
            labelRenderer={false}
            showTrackFill={false}
            onChange={(value) => updateTextSpacing({ lineHeight: value / 100 })}
          />
          <div className="right-context-spacing-menu__row">
            <span className="right-context-spacing-menu__label">Letter spacing</span>
            <NumericInput
              value={letterSpacing}
              onValueChange={(value) => {
                if (!Number.isNaN(value)) updateTextSpacing({ letterSpacing: value / 100 })
              }}
              min={-50}
              max={250}
              buttonPosition="none"
              className="right-context-spacing-menu__input"
            />
          </div>
          <Slider
            value={letterSpacing}
            min={-50}
            max={250}
            stepSize={1}
            labelRenderer={false}
            showTrackFill={false}
            onChange={(value) => updateTextSpacing({ letterSpacing: value / 100 })}
          />
        </div>
      }
    >
      <Tooltip content="Spacing" position={Position.LEFT}>
        <button
          type="button"
          aria-label="Text spacing"
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
            window.setTimeout(() => setIsOpen(true), 0)
          }}
        >
          <span className="right-context-drawer__nav-icon">
            <SlidersHorizontal className="h-5 w-5" />
          </span>
          <span className="right-context-drawer__nav-label">Spacing</span>
        </button>
      </Tooltip>
    </Popover>
  )
}
