"use client"

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

function BorderWidthIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      className="lined-border-width-picker__icon"
    >
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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

const LinedBorderWidthPicker = observer(
  ({
    store,
    elements,
  }: {
    store: any
    elements: any[]
  }) => {
    const linedBoxes = (elements || []).filter(isLinedWritingBox)
    const hasSelection = linedBoxes.length > 0
    const currentBorderSize = Math.max(Number(linedBoxes[0]?.borderSize || 2), 0)

    const updateBorderSize = (value: number) => {
      const normalizedValue = Math.max(0, Math.min(value, 24))

      store.history.transaction(() => {
        linedBoxes.forEach((element: any) => {
          element.set({ borderSize: normalizedValue })
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
        }
      >
        <Tooltip
          content="Border width"
          disabled={!hasSelection}
          position={Position.BOTTOM}
        >
          <Button
            minimal
            disabled={!hasSelection}
            aria-label="Border width"
            icon={<BorderWidthIcon />}
            className="lined-border-width-picker__trigger"
          />
        </Tooltip>
      </Popover>
    )
  }
)

export default LinedBorderWidthPicker
