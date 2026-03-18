"use client"

import ColorPicker from "polotno/toolbar/color-picker"

export default function TextFillControl({
  elements,
  store,
  position = "left-top",
}: {
  elements: any[]
  store: any
  position?: any
}) {
  return (
    <ColorPicker
      value={elements[0].fill}
      store={store}
      position={position}
      onChange={(color) =>
        store.history.transaction(() => {
          elements.forEach((element) => {
            element.set({ fill: color })
          })
        })
      }
    />
  )
}
