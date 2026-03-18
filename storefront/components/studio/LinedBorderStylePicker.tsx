"use client"

import { type ReactNode } from "react"
import { observer } from "mobx-react-lite"
import {
  Button,
  NumericInput,
  Popover,
  Position,
  Slider,
  Tooltip,
} from "@blueprintjs/core"
import { isLinedWritingBox } from "../editor/linedWritingBox"

function BorderStyleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      className="lined-border-width-picker__icon"
    >
      <path
        d="M6 18V10a4 4 0 014-4h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 17.5h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

const LinedBorderStylePicker = observer(
  ({
    store,
    elements,
    triggerClassName = "lined-border-width-picker__trigger",
    triggerLabel = "Border",
    triggerIcon,
    customTrigger = false,
  }: {
    store: any
    elements: any[]
    triggerClassName?: string
    triggerLabel?: string
    triggerIcon?: ReactNode
    customTrigger?: boolean
  }) => {
    const linedBoxes = (elements || []).filter(isLinedWritingBox)
    const hasSelection = linedBoxes.length > 0
    const currentBorderSize = Math.max(Number(linedBoxes[0]?.borderSize || 2), 0)
    const currentCornerRadius = Math.max(
      Number(linedBoxes[0]?.cornerRadius ?? 18),
      0
    )

    const updateBorderSize = (value: number) => {
      const normalizedValue = Math.max(0, Math.min(value, 24))

      store.history.transaction(() => {
        linedBoxes.forEach((element: any) => {
          element.set({ borderSize: normalizedValue })
        })
      })
    }

    const updateCornerRadius = (value: number) => {
      const normalizedValue = Math.max(0, Math.min(value, 48))

      store.history.transaction(() => {
        linedBoxes.forEach((element: any) => {
          element.set({ cornerRadius: normalizedValue })
        })
      })
    }

    return (
      <Popover
        disabled={!hasSelection}
        minimal={false}
        position={Position.BOTTOM}
        popoverClassName="lined-border-width-picker__popover-shell"
        content={
          <div className="lined-border-width-picker__popover">
            <div className="lined-border-width-picker__section">
              <div className="lined-border-width-picker__label">Border width</div>
              <div className="lined-border-width-picker__controls">
                <div className="lined-border-width-picker__slider">
                  <Slider
                    value={currentBorderSize}
                    labelRenderer={false}
                    onChange={updateBorderSize}
                    min={0}
                    max={24}
                    stepSize={1}
                  />
                </div>
                <NumericInput
                  value={currentBorderSize}
                  onValueChange={updateBorderSize}
                  min={0}
                  max={24}
                  buttonPosition="none"
                  style={{ width: "56px" }}
                  selectAllOnFocus
                />
              </div>
            </div>
            <div className="lined-border-width-picker__section lined-border-width-picker__section--secondary">
              <div className="lined-border-width-picker__label">Border radius</div>
              <div className="lined-border-width-picker__controls">
                <div className="lined-border-width-picker__slider">
                  <Slider
                    value={currentCornerRadius}
                    labelRenderer={false}
                    onChange={updateCornerRadius}
                    min={0}
                    max={48}
                    stepSize={1}
                  />
                </div>
                <NumericInput
                  value={currentCornerRadius}
                  onValueChange={updateCornerRadius}
                  min={0}
                  max={48}
                  buttonPosition="none"
                  style={{ width: "56px" }}
                  selectAllOnFocus
                />
              </div>
            </div>
          </div>
        }
      >
        <Tooltip
          content="Border"
          disabled={!hasSelection}
          position={Position.BOTTOM}
        >
          {customTrigger ? (
            <button
              type="button"
              disabled={!hasSelection}
              aria-label={triggerLabel}
              className={triggerClassName}
            >
              <span className="right-context-drawer__nav-icon">
                {triggerIcon || <BorderStyleIcon />}
              </span>
              <span className="right-context-drawer__nav-label">{triggerLabel}</span>
            </button>
          ) : (
            <Button
              minimal
              disabled={!hasSelection}
              aria-label="Border"
              icon={<BorderStyleIcon />}
              className={triggerClassName}
            />
          )}
        </Tooltip>
      </Popover>
    )
  }
)

export default LinedBorderStylePicker
