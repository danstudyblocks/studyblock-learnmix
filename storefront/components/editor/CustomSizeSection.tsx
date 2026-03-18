"use client"
import { observer } from "mobx-react-lite"
import { SectionTab } from "polotno/side-panel"

// Custom presets: postcard, A4, A3, A2, A1, PowerPoint, sticker
const customPresets = [
  { name: "Postcard", width: 148, height: 105 }, // A6 size in mm
  { name: "A4", width: 210, height: 297 },
  { name: "A3", width: 297, height: 420 },
  { name: "A2", width: 420, height: 594 },
  { name: "A1", width: 594, height: 841 },
  { name: "PowerPoint", width: 254, height: 190 }, // 10x7.5 inches in mm
  { name: "Sticker", width: 50, height: 50 }, // Small sticker size
]

export const CustomSizeSection = {
  name: "resize",
  Tab: (props: any) => (
    <SectionTab name="Resize" {...props}>
      <i className="fas fa-expand" />
    </SectionTab>
  ),
  Panel: observer(({ store }: { store: any }) => {
    const page = store.activePage

    // Conversion functions
    const mmToPx = (mm: number) => (mm / 25.4) * 96
    const pxToMm = (px: number) => (px * 25.4) / 96

    const applyPreset = (preset: { name: string; width: number; height: number }) => {
      if (!page) return
      
      page.set({
        width: mmToPx(preset.width),
        height: mmToPx(preset.height),
      })
    }

    return (
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Preset Sizes</h3>
          <div className="space-y-2">
            {customPresets.map((preset) => (
              <button
                key={preset.name}
                className="w-full px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                onClick={() => applyPreset(preset)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{preset.name}</span>
                  <span className="text-xs text-gray-500">
                    {preset.width} × {preset.height} mm
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Manual resize inputs */}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">Custom Size</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Width (mm)</label>
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                value={Math.round(pxToMm(page?.width || 0))}
                onChange={(e) => {
                  const widthMm = parseFloat(e.target.value) || 0
                  if (page && widthMm > 0) {
                    page.set({ width: mmToPx(widthMm) })
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Height (mm)</label>
              <input
                type="number"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                value={Math.round(pxToMm(page?.height || 0))}
                onChange={(e) => {
                  const heightMm = parseFloat(e.target.value) || 0
                  if (page && heightMm > 0) {
                    page.set({ height: mmToPx(heightMm) })
                  }
                }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter dimensions in millimeters (mm)
          </p>
        </div>
      </div>
    )
  }),
}

