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
      <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
        {/* Header */}
        <div className="border-b border-[#d8d2c8] px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
            Canvas
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">Resize</h2>
          <p className="mt-3 text-sm leading-6 text-[#5d5549]">
            Choose a preset or enter a custom size in millimetres.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Presets */}
          <div className="rounded-2xl border border-[#d8d2c8] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f7668] mb-3">
              Preset sizes
            </p>
            <div className="space-y-2">
              {customPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="w-full rounded-xl border border-[#ddd6cb] bg-[#fcfaf8] px-4 py-2.5 text-left transition hover:border-[#171717]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#171717]">
                      {preset.name}
                    </span>
                    <span className="rounded-full bg-[#f3ede3] px-2.5 py-0.5 text-xs font-semibold text-[#5d5549]">
                      {preset.width} × {preset.height} mm
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom size */}
          <div className="rounded-2xl border border-[#d8d2c8] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f7668] mb-3">
              Custom size
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[#7f7668]">
                  Width (mm)
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-[#d4ccbf] bg-[#fcfaf8] px-3 py-2 text-sm text-[#171717] outline-none transition focus:border-[#7b5cff]"
                  value={Math.round(pxToMm(page?.width || 0))}
                  onChange={(e) => {
                    const widthMm = parseFloat(e.target.value) || 0
                    if (page && widthMm > 0) page.set({ width: mmToPx(widthMm) })
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[#7f7668]">
                  Height (mm)
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-[#d4ccbf] bg-[#fcfaf8] px-3 py-2 text-sm text-[#171717] outline-none transition focus:border-[#7b5cff]"
                  value={Math.round(pxToMm(page?.height || 0))}
                  onChange={(e) => {
                    const heightMm = parseFloat(e.target.value) || 0
                    if (page && heightMm > 0) page.set({ height: mmToPx(heightMm) })
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }),
}

