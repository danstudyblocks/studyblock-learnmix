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

function OpacityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      className="custom-opacity-picker__icon"
    >
      <path
        d="M12 2.8L6.52 8.28a7.75 7.75 0 1010.96 0L12 2.8zm0 17.45A6.26 6.26 0 015.75 14c0-1.67.65-3.23 1.83-4.41L12 5.18l4.42 4.41A6.21 6.21 0 0118.25 14 6.26 6.26 0 0112 20.25z"
        fill="currentColor"
      />
    </svg>
  )
}

const CustomOpacityPicker = observer(({ store }: { store: any }) => {
  const selectedShapes = store.selectedShapes || store.selectedElements || []
  const hasSelection = selectedShapes.length > 0
  const currentOpacity = Math.round(100 * (selectedShapes[0]?.opacity ?? 1))

  const updateOpacity = (value: number) => {
    const clampedValue = Math.max(0, Math.min(value, 100))

    store.history.transaction(() => {
      selectedShapes.forEach((shape: any) => {
        shape.set({ opacity: clampedValue / 100 })
      })
    })
  }

  return (
    <Popover
      disabled={!hasSelection}
      minimal={false}
      position={Position.BOTTOM}
      content={
        <div style={{ padding: "10px 20px" }}>
          <div style={{ textAlign: "center", color: "#111111" }}>
            Transparency
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ paddingTop: "8px", paddingRight: "20px", flex: 1 }}>
              <Slider
                value={currentOpacity}
                labelRenderer={false}
                onChange={updateOpacity}
                min={0}
                max={100}
              />
            </div>
            <NumericInput
              value={currentOpacity}
              onValueChange={updateOpacity}
              min={0}
              max={100}
              buttonPosition="none"
              style={{ width: "50px" }}
              selectAllOnFocus
            />
          </div>
        </div>
      }
    >
      <Tooltip
        content="Transparency"
        disabled={!hasSelection}
        position={Position.BOTTOM}
      >
        <Button
          minimal
          disabled={!hasSelection}
          aria-label="Transparency"
          icon={<OpacityIcon />}
        />
      </Tooltip>
    </Popover>
  )
})

export default CustomOpacityPicker
