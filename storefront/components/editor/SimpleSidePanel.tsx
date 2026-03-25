"use client"

import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import {
  TextSection,
  ElementsSection,
  UploadSection,
  PhotosSection,
  LayersSection,
} from "polotno/side-panel"
import { FaChevronLeft } from "react-icons/fa"
import {
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Shapes,
  Upload,
  Layers,
  Sparkles,
  Download,
  Crown,
  Maximize2,
  Star,
  Grid3x3,
  ShoppingCart,
  NotebookPen,
  BookOpen,
} from "lucide-react"

import CustomSvgAssetsSection from "./CustomSvgAssetsSection"
import NounProjectSection from "./NounProjectSection"
import CustomTemplatesSection from "./CustomTemplatesSection"
import { CustomSizeSection } from "./CustomSizeSection"
import { AiSection } from "./AiSection"
import BlocksSection from "./BlocksSection"
import LinedWritingSection from "./LinedWritingSection"
import { TeacherNotesSection } from "./TeacherNotesSection"
import { downloadHighQualityPdf } from "./utils/pdf"
import type { WritingGuidePreset } from "./linedWritingBox"

type PanelSection = {
  name: string
  icon: any
  title: string
  Tab?: any
  customRender?: (store: any) => React.ReactNode
}

/** Simple download panel for left sidebar */
const DownloadPanel = ({ store }: { store: any }) => {
  const [loading, setLoading] = useState(false)
  const handlePdf = async () => {
    setLoading(true)
    try {
      await downloadHighQualityPdf(store, {
        fileName: "design.pdf",
        pixelRatio: 5,
        includeBleed: true,
        cropMarkSize: 0,
      })
    } catch (e) {
      console.error(e)
      alert("Download failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  const handlePng = async () => {
    setLoading(true)
    try {
      await store.saveAsImage({ fileName: "design.png", pixelRatio: 2 })
    } catch (e) {
      console.error(e)
      alert("Download failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
      <div className="border-b border-[#d8d2c8] px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
          Export
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight">Download</h2>
        <p className="mt-3 text-sm leading-6 text-[#5d5549]">
          Save your design as a high-quality file.
        </p>
      </div>
      <div className="px-6 py-5 space-y-3">
        <div className="rounded-2xl border border-[#d8d2c8] bg-white p-4 space-y-3">
          <button
            type="button"
            onClick={handlePdf}
            disabled={loading}
            className="w-full rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2620] disabled:opacity-50"
          >
            {loading ? "Preparing…" : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={handlePng}
            disabled={loading}
            className="w-full rounded-xl border border-[#d4ccbf] bg-[#fcfaf8] px-4 py-3 text-sm font-semibold text-[#3d352c] transition hover:border-[#171717] disabled:opacity-50"
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  )
}

/** Add to Learnmix panel */
const AddToLearnmixPanel = ({ store, onAddToLearnmix }: { store: any; onAddToLearnmix: () => void }) => {
  return (
    <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
      <div className="border-b border-[#d8d2c8] px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
          Library
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight">
          Add to Learnmix
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#5d5549]">
          Save your design to your Learnmix library and access it anytime.
        </p>
      </div>
      <div className="px-6 py-5">
        <div className="rounded-2xl border border-[#d8d2c8] bg-white p-4">
          <button
            type="button"
            onClick={onAddToLearnmix}
            className="w-full rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2620] flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Learnmix
          </button>
        </div>
      </div>
    </div>
  )
}

const sections: PanelSection[] = [
  { name: "templates", Tab: CustomTemplatesSection, icon: LayoutTemplate, title: "Templates" },
  { name: "text", Tab: TextSection, icon: Type, title: "Text" },
  { name: "elements", Tab: CustomSvgAssetsSection, icon: Crown, title: "Elements" },
  { name: "photos", Tab: PhotosSection, icon: ImageIcon, title: "Photos" },
  { name: "shapes", icon: Shapes, title: "Shapes" },
  { name: "uploads", Tab: UploadSection, icon: Upload, title: "Uploads" },
  { name: "lined-writing", icon: NotebookPen, title: "Writing Lines" },
  { name: "ai-tools", Tab: AiSection, icon: Sparkles, title: "AI Tools" },
  { name: "blocks", Tab: BlocksSection, icon: Grid3x3, title: "Blocks" },
  { name: "layers", Tab: LayersSection, icon: Layers, title: "Layers" },
  { name: "resize", Tab: CustomSizeSection, icon: Maximize2, title: "Resize" },
  { name: "download", icon: Download, title: "Download", customRender: (store) => <DownloadPanel store={store} /> },
  { name: "add-to-learnmix", icon: ShoppingCart, title: "Share", customRender: (store, onAddToLearnmix) => <AddToLearnmixPanel store={store} onAddToLearnmix={onAddToLearnmix} /> },
  { name: "teacher-notes", icon: BookOpen, title: "Notes" },
]

export const SimpleSidePanel = observer(
  ({
    store,
    customer,
    onAddToLearnmix,
    activeWritingGuide,
    onActivateWritingGuideTool,
    onDeactivateWritingGuideTool,
  }: {
    store: any
    customer: any
    onAddToLearnmix?: () => void
    activeWritingGuide: WritingGuidePreset | null
    onActivateWritingGuideTool: (preset: WritingGuidePreset) => void
    onDeactivateWritingGuideTool: () => void
  }) => {
    const [activeSection, setActiveSection] = useState("")
    const [isContentVisible, setIsContentVisible] = useState(false)

    const handleSectionClick = (sectionName: string) => {
      if (activeSection === sectionName) {
        if (sectionName === "lined-writing" && isContentVisible) {
          onDeactivateWritingGuideTool()
        }
        setIsContentVisible(!isContentVisible)
      } else {
        if (activeSection === "lined-writing") {
          onDeactivateWritingGuideTool()
        }
        setActiveSection(sectionName)
        setIsContentVisible(true)
      }
    }

    const getPanelWidth = () => {
      if (
        activeSection === "templates" ||
        activeSection === "elements" ||
        activeSection === "shapes" ||
        activeSection === "blocks" ||
        activeSection === "ai-tools" ||
        activeSection === "lined-writing"
      ) {
        return "w-[600px] md:w-[700px]"
      }
      return "w-[336px] md:w-[384px]"
    }

    const renderSectionContent = () => {
      const section = sections.find((item) => item.name === activeSection)
      if (!section) {
        return null
      }

      if (section.customRender) {
        if (section.name === "add-to-learnmix" && onAddToLearnmix) {
          return section.customRender(store, onAddToLearnmix)
        }
        return section.customRender(store)
      }

      if (section.name === "templates") {
        return <CustomTemplatesSection store={store} customer={customer} />
      }

      if (section.name === "elements") {
        return <CustomSvgAssetsSection store={store} customer={customer} />
      }

      if (section.name === "shapes") {
        return <NounProjectSection store={store} />
      }

      if (section.name === "blocks") {
        return <BlocksSection store={store} customer={customer} />
      }

      if (section.name === "ai-tools") {
        return <AiSection.Panel store={store} />
      }

      if (section.name === "lined-writing") {
        return (
          <LinedWritingSection
            activePreset={activeWritingGuide}
            onActivate={onActivateWritingGuideTool}
            onDeactivate={onDeactivateWritingGuideTool}
          />
        )
      }

      if (section.name === "resize") {
        return <CustomSizeSection.Panel store={store} />
      }

      if (section.name === "teacher-notes") {
        return <TeacherNotesSection store={store} />
      }

      // Polotno built-in panels — wrap with consistent header
      const builtInHeaders: Record<string, { subtitle: string; title: string; description: string }> = {
        text: {
          subtitle: "Typography",
          title: "Text",
          description: "Add headings, labels, and body text to your canvas.",
        },
        photos: {
          subtitle: "Media",
          title: "Photos",
          description: "Browse and add stock photos to your design.",
        },
        shapes: {
          subtitle: "Graphics",
          title: "Shapes",
          description: "Add geometric shapes and decorative elements.",
        },
        uploads: {
          subtitle: "Files",
          title: "Uploads",
          description: "Upload your own images and files to use in your design.",
        },
        layers: {
          subtitle: "Structure",
          title: "Layers",
          description: "View and reorder all elements on the canvas.",
        },
      }

      const header = builtInHeaders[section.name]

      // @ts-ignore Polotno sections expose Panel under Tab
      if (section.Tab?.Panel) {
        return (
          <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
            {header && (
              <div className="border-b border-[#d8d2c8] px-6 py-6 flex-shrink-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
                  {header.subtitle}
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight">{header.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#5d5549]">{header.description}</p>
              </div>
            )}
            <div className={`flex-1 overflow-hidden${section.name === "layers" ? " layers-panel-wrap" : " px-6 py-4"}`}>
              {/* @ts-ignore */}
              <section.Tab.Panel store={store} hideHeader={true} className="h-full" />
            </div>
          </div>
        )
      }

      return null
    }

    return (
      <div className="flex h-full">
        <div className="w-[92px] min-w-[92px] border-r border-gray-200 bg-[#F5F2EE] p-1.5 overflow-y-auto flex flex-col items-center">
          <div className="grid grid-cols-1 gap-0.5">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive =
                activeSection === section.name && isContentVisible

              return (
                <button
                  key={section.name}
                  type="button"
                  onClick={() => handleSectionClick(section.name)}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 w-full rounded-lg transition-all cursor-pointer min-h-[52px] ${
                    isActive
                      ? "bg-blue-50 border border-blue-500 text-blue-700"
                      : "hover:bg-gray-200/80 text-gray-700"
                  }`}
                  title={section.title}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-[10px] leading-tight text-center font-medium text-gray-800 whitespace-nowrap">
                    {section.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {isContentVisible && (
          <div
            className={`relative overflow-y-auto border-l border-gray-200 ${getPanelWidth()} bg-[#fcfaf8]`}
          >
            <button
              onClick={() => {
                if (activeSection === "lined-writing") {
                  onDeactivateWritingGuideTool()
                }
                setIsContentVisible(false)
              }}
              className="absolute right-3 top-3 z-10 rounded-full p-2 transition-colors hover:bg-gray-100"
              title="Close panel"
            >
              <FaChevronLeft className="h-4 w-4 text-gray-600" />
            </button>

            <div className="min-h-full">{renderSectionContent()}</div>
          </div>
        )}
      </div>
    )
  }
)
