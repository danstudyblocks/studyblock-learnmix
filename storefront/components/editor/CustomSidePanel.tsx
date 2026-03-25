import { observer } from "mobx-react-lite"
import Lottie from "lottie-react"
import { useState } from "react"
import {
  TextSection,
  ElementsSection,
  UploadSection,
  PhotosSection,
  LayersSection,
} from "polotno/side-panel"
import { FaChevronLeft } from "react-icons/fa"

import ai_icon from "../../public/design-edit-icons-and-svgs/icons/ai_icon.json"
import blocks_icon from "../../public/design-edit-icons-and-svgs/icons/blocks_icon.json"
import chat_icon from "../../public/design-edit-icons-and-svgs/icons/chat_icon.json"
import icons_icon from "../../public/design-edit-icons-and-svgs/icons/icons_icon.json"
import layers_icon from "../../public/design-edit-icons-and-svgs/icons/layers_icon.json"
import photos_icon from "../../public/design-edit-icons-and-svgs/icons/photos_icon.json"
import resize_icon from "../../public/design-edit-icons-and-svgs/icons/resize_icon.json"
import shaps_icon from "../../public/design-edit-icons-and-svgs/icons/shaps_icon.json"
import templates_icon from "../../public/design-edit-icons-and-svgs/icons/templates_icon.json"
import text_icon from "../../public/design-edit-icons-and-svgs/icons/text_icon.json"
import upload_icon from "../../public/design-edit-icons-and-svgs/icons/upload_icon.json"

import { AiSection } from "./AiSection"
import BlocksSection from "./BlocksSection"
import CustomSvgAssetsSection from "./CustomSvgAssetsSection"
import CustomTemplatesSection from "./CustomTemplatesSection"
import { CustomSizeSection } from "./CustomSizeSection"
import { TeacherNotesSection } from "./TeacherNotesSection"

type PanelSection = {
  name: string
  icon: Record<string, unknown>
  title: string
  Tab: any
}

const sections: PanelSection[] = [
  {
    name: "templates",
    Tab: CustomTemplatesSection,
    icon: templates_icon,
    title: "Templates",
  },
  {
    name: "text",
    Tab: TextSection,
    icon: text_icon,
    title: "Text",
  },
  {
    name: "icons",
    Tab: CustomSvgAssetsSection,
    icon: icons_icon,
    title: "Icons",
  },
  {
    name: "photos",
    Tab: PhotosSection,
    icon: photos_icon,
    title: "Photos",
  },
  {
    name: "shapes",
    Tab: ElementsSection,
    icon: shaps_icon,
    title: "Shapes",
  },
  {
    name: "upload",
    Tab: UploadSection,
    icon: upload_icon,
    title: "Upload",
  },
  {
    name: "ai",
    Tab: AiSection,
    icon: ai_icon,
    title: "AI tools",
  },
  {
    name: "blocks",
    Tab: BlocksSection,
    icon: blocks_icon,
    title: "Blocks",
  },
  {
    name: "resize",
    Tab: CustomSizeSection,
    icon: resize_icon,
    title: "Resize",
  },
  {
    name: "layers",
    Tab: LayersSection,
    icon: layers_icon,
    title: "Layers",
  },
  {
    name: "teacher-notes",
    Tab: TeacherNotesSection,
    icon: chat_icon,
    title: "Notes",
  },
]

export const CustomSidePanel = observer(
  ({ store, customer }: { store: any; customer: any }) => {
    const [activeSection, setActiveSection] = useState("")
    const [isContentVisible, setIsContentVisible] = useState(false)
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

    const handleSectionClick = (sectionName: string) => {
      if (activeSection === sectionName) {
        setIsContentVisible(!isContentVisible)
      } else {
        setActiveSection(sectionName)
        setIsContentVisible(true)
      }
    }

    const getPanelWidth = () => {
      if (activeSection === "templates" || activeSection === "icons") {
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

      if (section.name === "icons") {
        return <CustomSvgAssetsSection store={store} customer={customer} />
      }

      if (section.name === "blocks") {
        return <BlocksSection store={store} customer={customer} />
      }

      if (section.name === "resize") {
        return <CustomSizeSection.Panel store={store} />
      }

      if (section.name === "teacher-notes") {
        return <TeacherNotesSection store={store} />
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
        <div className="w-16 md:w-20 border-r border-gray-200 bg-white p-1 md:p-2 overflow-y-auto">
          <div className="grid grid-cols-1 gap-0.5 md:gap-1">
            {sections.map((section) => {
              const isActive =
                activeSection === section.name && isContentVisible

              return (
                <button
                  key={section.name}
                  type="button"
                  onClick={() => handleSectionClick(section.name)}
                  onMouseEnter={() => setHoveredIcon(section.name)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className={`p-1 md:p-1.5 w-full rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-50 border border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <div className="h-6 w-6 md:h-8 md:w-8">
                      <Lottie
                        animationData={section.icon}
                        loop={
                          hoveredIcon === section.name ||
                          (activeSection === section.name && isContentVisible)
                        }
                        autoplay={
                          hoveredIcon === section.name ||
                          (activeSection === section.name && isContentVisible)
                        }
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                    <span className="mt-0.5 text-[8px] font-medium md:text-[10px]">
                      {section.title}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {isContentVisible && (
          <div
            className={`relative overflow-y-auto bg-white ${getPanelWidth()}`}
          >
            <button
              onClick={() => setIsContentVisible(false)}
              className="absolute right-3 top-3 z-10 rounded-full p-2 transition-colors hover:bg-gray-100"
              title="Close panel"
            >
              <FaChevronLeft className="h-4 w-4 text-gray-600" />
            </button>

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
