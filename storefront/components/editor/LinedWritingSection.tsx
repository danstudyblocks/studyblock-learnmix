"use client"

import { observer } from "mobx-react-lite"
import type { WritingGuidePreset } from "./linedWritingBox"

type LinedWritingSectionProps = {
  activePreset: WritingGuidePreset | null
  onActivate: (preset: WritingGuidePreset) => void
  onDeactivate: () => void
}

const lineOptions: WritingGuidePreset[] = [
  {
    kind: "lines",
    spacingMm: 9,
  },
  {
    kind: "lines",
    spacingMm: 11,
  },
  {
    kind: "lines",
    spacingMm: 14,
  },
]

const gridOptions: WritingGuidePreset[] = [
  {
    kind: "grid",
    spacingMm: 5,
  },
  {
    kind: "grid",
    spacingMm: 10,
  },
  {
    kind: "grid",
    spacingMm: 20,
  },
]

const optionContent = {
  "lines-9": {
    title: "9mm lines",
    description: "Tighter spacing for smaller handwriting or denser worksheet answers.",
  },
  "lines-11": {
    title: "11mm lines",
    description: "Balanced spacing for everyday classroom writing and guided responses.",
  },
  "lines-14": {
    title: "14mm lines",
    description: "Wider spacing for early writers, SEND support, or large-print layouts.",
  },
  "grid-5": {
    title: "5mm grid",
    description: "Fine graph paper spacing for maths, plotting, and detailed note layouts.",
  },
  "grid-10": {
    title: "10mm grid",
    description: "Medium square grid for classroom diagrams, number work, and planning boxes.",
  },
  "grid-20": {
    title: "20mm grid",
    description: "Large square grid for early learners, manipulatives, and bold visual scaffolds.",
  },
} satisfies Record<string, { title: string; description: string }>

const renderOptionGroup = ({
  title,
  description,
  options,
  activePreset,
  onActivate,
  onDeactivate,
}: {
  title: string
  description: string
  options: WritingGuidePreset[]
  activePreset: WritingGuidePreset | null
  onActivate: (preset: WritingGuidePreset) => void
  onDeactivate: () => void
}) => (
  <div className="space-y-3">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f7668]">
        {title}
      </p>
      <p className="mt-1 text-sm leading-6 text-[#5d5549]">{description}</p>
    </div>

    <div className="grid gap-3">
      {options.map((option) => {
        const key = `${option.kind}-${option.spacingMm}` as keyof typeof optionContent
        const content = optionContent[key]
        const isActive =
          activePreset?.kind === option.kind &&
          activePreset?.spacingMm === option.spacingMm

        return (
          <button
            key={key}
            type="button"
            onClick={() => (isActive ? onDeactivate() : onActivate(option))}
            className={`rounded-[22px] border px-5 py-4 text-left transition ${
              isActive
                ? "border-[#171717] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
                : "border-[#ddd6cb] bg-white hover:border-[#171717]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#171717]">
                  {content.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5d5549]">
                  {content.description}
                </p>
              </div>

              <div
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                  isActive
                    ? "border-[#171717] text-[#171717]"
                    : "border-[#d4ccbf] text-[#7f7668]"
                }`}
              >
                {option.spacingMm}mm
              </div>
            </div>
          </button>
        )
      })}
    </div>
  </div>
)

const LinedWritingSection = observer(
  ({ activePreset, onActivate, onDeactivate }: LinedWritingSectionProps) => {
    return (
      <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
        {/* Header */}
        <div className="border-b border-[#d8d2c8] px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
            Writing Tool
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">
            Lined writing box
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5d5549]">
            Pick lined or grid spacing, then drag on the canvas to draw a writing
            guide at the exact size you need.
          </p>

          {/* Active state indicator */}
          <div className="mt-4 flex items-center gap-3">
            {activePreset ? (
              <>
                <div className="rounded-full bg-[#171717] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  Draw mode on: {activePreset.spacingMm}mm {activePreset.kind}
                </div>
                <button
                  type="button"
                  onClick={onDeactivate}
                  className="rounded-full border border-[#d4ccbf] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#5d5549] transition hover:border-[#171717] hover:text-[#171717]"
                >
                  Stop drawing
                </button>
              </>
            ) : (
              <div className="rounded-full border border-[#d4ccbf] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#7f7668]">
                Select a spacing to begin
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {renderOptionGroup({
            title: "Lined guides",
            description: "Exercise-book style ruled boxes for handwriting and longer written responses.",
            options: lineOptions,
            activePreset,
            onActivate,
            onDeactivate,
          })}

          {renderOptionGroup({
            title: "Grid guides",
            description: "Square grids for maths, graphing, layout planning, or structured worksheet tasks.",
            options: gridOptions,
            activePreset,
            onActivate,
            onDeactivate,
          })}

          <div className="rounded-2xl border border-[#d8d2c8] bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f7668]">
              How it works
            </p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-[#5d5549]">
              <li>1. Select a lined or grid spacing option.</li>
              <li>2. Drag on the page to draw the writing area.</li>
              <li>3. Resize or duplicate the box like any other canvas element.</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }
)

export default LinedWritingSection
