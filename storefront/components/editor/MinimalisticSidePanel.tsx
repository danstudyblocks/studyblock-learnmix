import { observer } from "mobx-react-lite"
import { useState } from "react"
import {
  TextSection,
  ElementsSection,
  UploadSection,
  PhotosSection,
  LayersSection,
} from "polotno/side-panel"
import { 
  LayoutTemplate, 
  Type, 
  Sparkles, 
  Image as ImageIcon, 
  Shapes, 
  Upload, 
  Layers,
  Palette,
  Star,
  X
} from "lucide-react"

import CustomSvgAssetsSection from "./CustomSvgAssetsSection"
import CustomTemplatesSection from "./CustomTemplatesSection"
import { CustomSizeSection } from "./CustomSizeSection"

type PanelSection = {
  name: string
  icon: any
  title: string
  Tab: any
}

const sections: PanelSection[] = [
  {
    name: "templates",
    Tab: CustomTemplatesSection,
    icon: LayoutTemplate,
    title: "Templates",
  },
  {
    name: "text",
    Tab: TextSection,
    icon: Type,
    title: "Text",
  },
  {
    name: "elements",
    Tab: CustomSvgAssetsSection,
    icon: Sparkles,
    title: "Elements",
  },
  {
    name: "photos",
    Tab: PhotosSection,
    icon: ImageIcon,
    title: "Photos",
  },
  {
    name: "shapes",
    Tab: ElementsSection,
    icon: Shapes,
    title: "Shapes",
  },
  {
    name: "upload",
    Tab: UploadSection,
    icon: Upload,
    title: "Uploads",
  },
  {
    name: "layers",
    Tab: LayersSection,
    icon: Layers,
    title: "Layers",
  },
  {
    name: "resize",
    Tab: CustomSizeSection,
    icon: Palette,
    title: "Resize",
  },
]

export const MinimalisticSidePanel = observer(
  ({ store, customer }: { store: any; customer: any }) => {
    const [activeSection, setActiveSection] = useState("")
    const [isContentVisible, setIsContentVisible] = useState(false)

    const handleSectionClick = (sectionName: string) => {
      if (activeSection === sectionName && isContentVisible) {
        setIsContentVisible(false)
        setActiveSection("")
      } else {
        setActiveSection(sectionName)
        setIsContentVisible(true)
      }
    }

    const getPanelWidth = () => {
      if (activeSection === "templates" || activeSection === "elements") {
        return "w-[600px] md:w-[700px]"
      }
      return "w-[280px] md:w-[320px]"
    }

    const renderSectionContent = () => {
      const section = sections.find((item) => item.name === activeSection)
      if (!section) {
        return null
      }

      if (section.name === "templates") {
        return <CustomTemplatesSection store={store} customer={customer} />
      }

      if (section.name === "elements") {
        return <CustomSvgAssetsSection store={store} customer={customer} />
      }

      if (section.name === "resize") {
        return <CustomSizeSection.Panel store={store} />
      }

      // @ts-ignore Polotno sections expose Panel under Tab
      if (section.Tab?.Panel) {
        return (
          // @ts-ignore
          <section.Tab.Panel
            store={store}
            // @ts-ignore
            hideHeader={true}
            className=""
          />
        )
      }

      return null
    }

    return (
      <div className="flex h-full">
        {/* Left Icon Bar */}
        <div className="w-12 border-r border-gray-200 bg-white flex flex-col items-center py-4 gap-2">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.name && isContentVisible

            return (
              <button
                key={section.name}
                type="button"
                onClick={() => handleSectionClick(section.name)}
                className={`p-2 rounded-lg transition-all cursor-pointer group relative ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                title={section.title}
              >
                <Icon className="w-5 h-5" />
                
                {/* Tooltip */}
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {section.title}
                </span>
              </button>
            )
          })}

          {/* Divider */}
          <div className="w-8 h-px bg-gray-300 my-2" />

          {/* Star/Favorites */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all group relative"
            title="Favorites"
          >
            <Star className="w-5 h-5" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Favorites
            </span>
          </button>
        </div>

        {/* Content Panel */}
        {isContentVisible && (
          <div
            className={`relative overflow-y-auto bg-white border-r border-gray-200 ${getPanelWidth()}`}
          >
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {sections.find((s) => s.name === activeSection)?.title}
              </h3>
              <button
                onClick={() => {
                  setIsContentVisible(false)
                  setActiveSection("")
                }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Close panel"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div className="px-1 py-2">{renderSectionContent()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)
