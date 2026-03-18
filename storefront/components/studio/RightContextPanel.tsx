"use client"

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import {
  Button,
  NumericInput,
  Popover,
  Position,
  Slider,
  Tooltip,
} from "@blueprintjs/core"
import { observer } from "mobx-react-lite"
import {
  AlignLeft,
  Bold,
  ChevronRight,
  Droplet,
  Image as ImageIcon,
  Italic,
  PenLine,
  Shapes,
  SlidersHorizontal,
  Sparkles,
  SquareMousePointer,
  Type,
  Underline,
} from "lucide-react"
import { DuplicateButton } from "polotno/toolbar/duplicate-button"
import { RemoveButton } from "polotno/toolbar/remove-button"
import { LockButton } from "polotno/toolbar/lock-button"
import {
  TextFontSize,
  TextSpacing,
  TextTransform,
} from "polotno/toolbar/text-toolbar"
import { FlipButton } from "polotno/toolbar/flip-button"
import { ImageFitToBackground } from "polotno/toolbar/image-toolbar"
import { FigureSettings } from "polotno/toolbar/figure-toolbar"
import {
  LineColor,
  LineHeads,
  LineSettings,
} from "polotno/toolbar/line-toolbar"
import TextColorMenuButton from "./TextColorMenuButton"
import SvgColorEditor from "./SvgColorEditor"
import TextFillControl from "./TextFillControl"
import Sketch from "polotno/toolbar/sketch"
import { DEFAULT_COLORS, getUsedColors } from "polotno/toolbar/color-picker"
import { sameColors, useSvgColors } from "polotno/utils/svg"
import TextFontFamilyControl from "./TextFontFamilyControl"
import TextSpacingMenuButton from "./TextSpacingMenuButton"
import TextAiMenuButton from "./TextAiMenuButton"
import CustomOpacityPicker from "./CustomOpacityPicker"
import InlineColorPickerField from "./InlineColorPickerField"
import { closeToolbarPopovers } from "./toolbarPopoverUtils"
import LinedBorderStylePicker from "./LinedBorderStylePicker"
import { isLinedWritingBox } from "../editor/linedWritingBox"

interface RightContextPanelProps {
  store: any
}

interface SectionDescriptor {
  key: string
  title: string
  icon: any
  content: ReactNode
}

interface RailItemDescriptor {
  key: string
  title: string
  icon: any
  active?: boolean
  onClick?: () => void
  render?: ReactNode
}

function PanelSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="right-context-panel__section">
      <div className="right-context-panel__section-title">{title}</div>
      <div className="right-context-panel__section-body">{children}</div>
    </section>
  )
}

function ToolRow({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`right-context-panel__tool-row ${className}`.trim()}>
      {children}
    </div>
  )
}

function ToolRowFull({ children }: { children: ReactNode }) {
  return (
    <div className="right-context-panel__tool-row right-context-panel__tool-row--full">
      {children}
    </div>
  )
}

function CompactActions({ store }: { store: any }) {
  return (
    <ToolRow>
      <CustomOpacityPicker store={store} />
      <LockButton store={store} />
      <DuplicateButton store={store} />
      <RemoveButton store={store} />
    </ToolRow>
  )
}

function formatPickerColor(nextColor: any) {
  if (typeof nextColor === "string") {
    return nextColor
  }

  if (nextColor?.rgb) {
    const { r, g, b, a } = nextColor.rgb
    if (typeof a === "number" && a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`
    }
  }

  return nextColor?.hex || "#000000"
}

function normalizeColorForCss(value: string | undefined | null) {
  if (!value) {
    return "#000000"
  }

  const trimmedValue = value.trim()
  if (/^[0-9a-fA-F]{3,8}$/.test(trimmedValue)) {
    return `#${trimmedValue}`
  }

  return trimmedValue
}

function getCurrentSvgColor(colorsReplace: Map<string, string>, color: string) {
  if (!colorsReplace) {
    return normalizeColorForCss(color)
  }

  const matchingKey = Array.from(colorsReplace.keys()).find((key) =>
    sameColors(key, color)
  )

  return normalizeColorForCss(colorsReplace.get(matchingKey || "") || color)
}

function RailPopoverButton({
  label,
  icon,
  content,
  disabled = false,
  tooltip,
}: {
  label: string
  icon: ReactNode
  content: ReactNode
  disabled?: boolean
  tooltip?: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleCloseAll = () => setIsOpen(false)
    document.addEventListener("close-all-toolbar-popovers", handleCloseAll)
    return () => {
      document.removeEventListener("close-all-toolbar-popovers", handleCloseAll)
    }
  }, [])

  return (
    <Popover
      isOpen={isOpen}
      disabled={disabled}
      onInteraction={(nextOpenState) => setIsOpen(nextOpenState)}
      position={Position.LEFT_TOP}
      content={content}
    >
      <Tooltip content={tooltip ?? label} position={Position.LEFT} disabled={disabled}>
        <button
          type="button"
          disabled={disabled}
          aria-label={label}
          aria-expanded={isOpen}
          className={`right-context-drawer__nav-button right-context-drawer__nav-button--tool${
            isOpen ? " right-context-drawer__nav-button--active" : ""
          }`}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            if (disabled) {
              return
            }

            if (isOpen) {
              setIsOpen(false)
              return
            }

            closeToolbarPopovers(event.currentTarget)
            window.setTimeout(() => setIsOpen(true), 0)
          }}
        >
          <span className="right-context-drawer__nav-icon">{icon}</span>
          <span className="right-context-drawer__nav-label">{label}</span>
        </button>
      </Tooltip>
    </Popover>
  )
}

function RailColorButton({
  label,
  value,
  store,
  onChange,
}: {
  label: string
  value: string
  store: any
  onChange: (color: string) => void
}) {
  const presetColors = useMemo(() => {
    return Array.from(new Set([...getUsedColors(store), ...DEFAULT_COLORS]))
  }, [store])

  return (
    <RailPopoverButton
      label={label}
      icon={<Droplet className="h-5 w-5" />}
      content={
        <Sketch
          color={value}
          presetColors={presetColors}
          onChange={(nextColor: any) => onChange(formatPickerColor(nextColor))}
        />
      }
    />
  )
}

function ShapeSettingsMenuButton({
  elements,
  store,
}: {
  elements: any[]
  store: any
}) {
  const activeElement = elements[0]
  const maxStrokeWidth = Math.max(0, Math.round(Math.min(activeElement?.width || 0, activeElement?.height || 0) / 2))
  const maxCornerRadius = Math.max(0, Math.round(Math.max(activeElement?.width || 0, activeElement?.height || 0) / 2))

  const applyUpdates = (attrs: Record<string, any>) => {
    store.history.transaction(() => {
      elements.forEach((element: any) => element.set(attrs))
    })
  }

  return (
    <RailPopoverButton
      label="Border"
      icon={<SlidersHorizontal className="h-5 w-5" />}
      content={
        <div className="right-context-spacing-menu">
          <div className="right-context-shape-settings__dash-row">
            <Button minimal active={!activeElement?.strokeWidth} onClick={() => applyUpdates({ strokeWidth: 0 })}>
              None
            </Button>
            <Button minimal active={Boolean(activeElement?.strokeWidth) && !(activeElement?.dash || []).length} onClick={() => applyUpdates({ dash: [], strokeWidth: activeElement?.strokeWidth || 4 })}>
              Solid
            </Button>
            <Button minimal active={Boolean(activeElement?.strokeWidth) && activeElement?.dash?.[0] === 4} onClick={() => applyUpdates({ dash: [4, 1], strokeWidth: activeElement?.strokeWidth || 4 })}>
              Dash
            </Button>
            <Button minimal active={Boolean(activeElement?.strokeWidth) && activeElement?.dash?.[0] === 1} onClick={() => applyUpdates({ dash: [1, 1], strokeWidth: activeElement?.strokeWidth || 4 })}>
              Dot
            </Button>
          </div>
          <div className="right-context-spacing-menu__row">
            <span className="right-context-spacing-menu__label">Stroke width</span>
            <NumericInput
              value={Math.round(activeElement?.strokeWidth || 0)}
              onValueChange={(value) => !Number.isNaN(value) && applyUpdates({ strokeWidth: Math.max(0, Math.min(value, maxStrokeWidth)) })}
              min={0}
              max={maxStrokeWidth}
              buttonPosition="none"
              className="right-context-spacing-menu__input"
            />
          </div>
          <Slider
            value={Math.round(activeElement?.strokeWidth || 0)}
            min={0}
            max={maxStrokeWidth}
            stepSize={1}
            labelRenderer={false}
            showTrackFill={false}
            onChange={(value) => applyUpdates({ strokeWidth: value })}
          />
          {activeElement?.subType === "rect" ? (
            <>
              <div className="right-context-spacing-menu__row">
                <span className="right-context-spacing-menu__label">Corner radius</span>
                <NumericInput
                  value={Math.round(activeElement?.cornerRadius || 0)}
                  onValueChange={(value) => !Number.isNaN(value) && applyUpdates({ cornerRadius: Math.max(0, Math.min(value, maxCornerRadius)) })}
                  min={0}
                  max={maxCornerRadius}
                  buttonPosition="none"
                  className="right-context-spacing-menu__input"
                />
              </div>
              <Slider
                value={Math.round(activeElement?.cornerRadius || 0)}
                min={0}
                max={maxCornerRadius}
                stepSize={1}
                labelRenderer={false}
                showTrackFill={false}
                onChange={(value) => applyUpdates({ cornerRadius: value })}
              />
            </>
          ) : null}
        </div>
      }
    />
  )
}

function SvgColorsMenuButton({
  element,
  store,
}: {
  element: any
  store: any
}) {
  const colors = useSvgColors(element?.src || "")

  if (!element || (!colors.length && !element?.colorsReplace?.size) || element.maskSrc) {
    return null
  }

  return (
    <RailPopoverButton
      label="Colours"
      icon={<Droplet className="h-5 w-5" />}
      content={
        <div className="right-context-svg-menu">
          <SvgColorEditor element={element} store={store} />
        </div>
      }
    />
  )
}

function FlipMenuButton({
  elements,
}: {
  elements: any[]
}) {
  const toggle = (prop: "flipX" | "flipY") => {
    elements.forEach((element: any) => {
      element.set({ [prop]: !element[prop] })
    })
  }

  return (
    <RailPopoverButton
      label="Flip"
      icon={<ImageIcon className="h-5 w-5" />}
      content={
        <div className="right-context-flip-menu">
          <Button minimal onClick={() => toggle("flipX")}>Flip horizontal</Button>
          <Button minimal onClick={() => toggle("flipY")}>Flip vertical</Button>
        </div>
      }
    />
  )
}

function TextStyleButton({
  active = false,
  label,
  onClick,
  children,
}: {
  active?: boolean
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`right-context-panel__icon-button${
        active ? " right-context-panel__icon-button--active" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const RightContextPanel = observer(({ store }: RightContextPanelProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const [activeSectionKey, setActiveSectionKey] = useState("")
  const selectedElements = store.selectedElements || []
  const selectedElement = selectedElements[0]
  const selectedTypes = new Set(
    selectedElements.map((element: any) => element.type)
  )
  const hasMixedSelection = selectedTypes.size > 1
  const selectedType = selectedElement?.type || null
  const panelTitle = selectedElement
    ? hasMixedSelection
      ? "Mixed Selection"
      : selectedType === "svg" && selectedElements.every(isLinedWritingBox)
        ? "Writing Box"
        : selectedType?.charAt(0).toUpperCase() + selectedType?.slice(1)
    : "Nothing Selected"

  const toggleTextProp = (
    property: string,
    activeValue: string,
    inactiveValue: string
  ) => {
    if (!selectedElement) {
      return
    }

    store.history.transaction(() => {
      selectedElements.forEach((element: any) => {
        element.set({
          [property]:
            element[property] === activeValue ? inactiveValue : activeValue,
        })
      })
    })
  }

  const cycleAlign = () => {
    if (!selectedElement) {
      return
    }

    const options = ["left", "center", "right", "justify"]
    const nextIndex =
      (options.indexOf(selectedElement.align) + 1 + options.length) %
      options.length

    store.history.transaction(() => {
      selectedElements.forEach((element: any) => {
        element.set({ align: options[nextIndex] })
      })
    })
  }

  const toggleUnderline = () => {
    if (!selectedElement) {
      return
    }

    store.history.transaction(() => {
      selectedElements.forEach((element: any) => {
        const parts = (element.textDecoration || "").split(" ").filter(Boolean)
        const nextDecoration = parts.includes("underline")
          ? parts.filter((part: string) => part !== "underline")
          : [...parts, "underline"]

        element.set({ textDecoration: nextDecoration.join(" ") })
      })
    })
  }

  useEffect(() => {
    const panelNode = panelRef.current
    if (!panelNode) {
      return
    }

    const handlePointerDownCapture = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) {
        return
      }

      const trigger = target.closest(
        [
          ".bp5-popover-target [aria-haspopup]",
          ".bp5-popover-target [aria-expanded]",
          ".bp5-popover-target [role='button']",
          ".canvas-font-menu__trigger",
        ].join(", ")
      ) as HTMLElement | null

      if (!trigger || !panelNode.contains(trigger)) {
        return
      }

      const isAlreadyExpanded = trigger.getAttribute("aria-expanded") === "true"
      if (isAlreadyExpanded) {
        return
      }

      const hasOpenPopover = Boolean(
        document.querySelector(".bp5-popover-open, .bp5-popover2-open")
      )

      if (!hasOpenPopover) {
        return
      }

      closeToolbarPopovers(trigger)
    }

    document.addEventListener("pointerdown", handlePointerDownCapture, true)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDownCapture, true)
    }
  }, [])

  const getSections = (): SectionDescriptor[] => {
    if (!selectedElement || hasMixedSelection) {
      return [
        {
          key: "selection",
          title: "Selection",
          icon: SquareMousePointer,
          content: (
            <PanelSection title="Selection">
              <CompactActions store={store} />
            </PanelSection>
          ),
        },
      ]
    }

    if (selectedType === "text") {
      return [
        {
          key: "typography",
          title: "Typography",
          icon: Type,
          content: (
            <PanelSection title="Typography">
              <ToolRow className="right-context-panel__tool-row--center">
                <TextFillControl
                  elements={selectedElements}
                  store={store}
                  position={Position.LEFT_TOP}
                />
              </ToolRow>
              <ToolRow className="right-context-panel__tool-row--center">
                <div className="right-context-panel__font-controls">
                  <div className="right-context-panel__font-family">
                    <TextFontFamilyControl
                      elements={selectedElements}
                      store={store}
                      position={Position.LEFT_TOP}
                    />
                  </div>
                  <div className="right-context-panel__font-size">
                    <TextFontSize elements={selectedElements} store={store} />
                  </div>
                </div>
              </ToolRow>
              <div className="right-context-panel__style-stack">
                <TextStyleButton label="Text align" onClick={cycleAlign}>
                  <AlignLeft className="h-5 w-5" />
                </TextStyleButton>
                <TextStyleButton
                  label="Bold"
                  active={
                    selectedElement.fontWeight === "bold" ||
                    selectedElement.fontWeight === "700"
                  }
                  onClick={() =>
                    toggleTextProp("fontWeight", "bold", "normal")
                  }
                >
                  <Bold className="h-5 w-5" />
                </TextStyleButton>
                <TextStyleButton
                  label="Italic"
                  active={selectedElement.fontStyle === "italic"}
                  onClick={() =>
                    toggleTextProp("fontStyle", "italic", "normal")
                  }
                >
                  <Italic className="h-5 w-5" />
                </TextStyleButton>
                <TextStyleButton
                  label="Underline"
                  active={selectedElement.textDecoration?.includes("underline")}
                  onClick={toggleUnderline}
                >
                  <Underline className="h-5 w-5" />
                </TextStyleButton>
                <div className="right-context-panel__style-stack-control">
                  <TextSpacing elements={selectedElements} store={store} />
                </div>
                <div className="right-context-panel__style-stack-control">
                  <TextTransform elements={selectedElements} store={store} />
                </div>
              </div>
            </PanelSection>
          ),
        },
        {
          key: "actions",
          title: "Actions",
          icon: SlidersHorizontal,
          content: (
            <PanelSection title="Actions">
              <ToolRow className="right-context-panel__action-grid right-context-panel__tool-row--center">
                <CustomOpacityPicker store={store} />
                <DuplicateButton store={store} />
                <RemoveButton store={store} />
              </ToolRow>
            </PanelSection>
          ),
        },
      ]
    }

    if (selectedType === "image") {
      return [
        {
          key: "image",
          title: "Image",
          icon: ImageIcon,
          content: (
            <PanelSection title="Image">
              <ToolRow>
                <FlipButton
                  element={selectedElement}
                  elements={selectedElements}
                />
                <ImageFitToBackground element={selectedElement} />
              </ToolRow>
            </PanelSection>
          ),
        },
        {
          key: "actions",
          title: "Actions",
          icon: SlidersHorizontal,
          content: (
            <PanelSection title="Actions">
              <CompactActions store={store} />
            </PanelSection>
          ),
        },
      ]
    }

    if (selectedType === "figure") {
      const hasStroke = selectedElements.some(
        (element: any) => element.strokeWidth
      )

      return [
        {
          key: "shape",
          title: "Shape",
          icon: Shapes,
          content: (
            <PanelSection title="Shape">
              <ToolRow>
                <InlineColorPickerField
                  value={selectedElement.fill}
                  store={store}
                  onChange={(color) =>
                    store.history.transaction(() => {
                      selectedElements.forEach((element: any) => {
                        element.set({ fill: color })
                      })
                    })
                  }
                />
                {hasStroke ? (
                  <InlineColorPickerField
                    value={selectedElement.stroke}
                    store={store}
                    ariaLabel="Pick stroke color"
                    onChange={(color) =>
                      store.history.transaction(() => {
                        selectedElements.forEach((element: any) => {
                          element.set({ stroke: color })
                        })
                      })
                    }
                  />
                ) : null}
                <FigureSettings
                  element={selectedElement}
                  elements={selectedElements}
                  store={store}
                />
              </ToolRow>
            </PanelSection>
          ),
        },
        {
          key: "actions",
          title: "Actions",
          icon: SlidersHorizontal,
          content: (
            <PanelSection title="Actions">
              <CompactActions store={store} />
            </PanelSection>
          ),
        },
      ]
    }

    if (selectedType === "line") {
      return [
        {
          key: "line",
          title: "Line",
          icon: PenLine,
          content: (
            <PanelSection title="Line">
              <ToolRow>
                <LineColor
                  element={selectedElement}
                  elements={selectedElements}
                  store={store}
                />
                <LineSettings
                  element={selectedElement}
                  elements={selectedElements}
                  store={store}
                />
              </ToolRow>
              <ToolRow>
                <LineHeads
                  element={selectedElement}
                  elements={selectedElements}
                  store={store}
                />
              </ToolRow>
            </PanelSection>
          ),
        },
        {
          key: "actions",
          title: "Actions",
          icon: SlidersHorizontal,
          content: (
            <PanelSection title="Actions">
              <ToolRow>
                <CustomOpacityPicker store={store} />
                <DuplicateButton store={store} />
                <RemoveButton store={store} />
              </ToolRow>
            </PanelSection>
          ),
        },
      ]
    }

    if (selectedType === "svg") {
      const isLinedWritingSelection = selectedElements.every(isLinedWritingBox)

      return [
        {
          key: "svg",
          title: isLinedWritingSelection ? "Writing Box" : "SVG",
          icon: isLinedWritingSelection ? Shapes : ImageIcon,
          content: (
            <PanelSection title={isLinedWritingSelection ? "Writing Box" : "SVG"}>
              <ToolRow>
                <FlipButton
                  element={selectedElement}
                  elements={selectedElements}
                />
                <SvgColorEditor element={selectedElement} store={store} />
              </ToolRow>
              {isLinedWritingSelection ? (
                <ToolRow>
                  <LinedBorderStylePicker
                    elements={selectedElements}
                    store={store}
                  />
                </ToolRow>
              ) : null}
            </PanelSection>
          ),
        },
        {
          key: "actions",
          title: "Actions",
          icon: SlidersHorizontal,
          content: (
            <PanelSection title="Actions">
              <CompactActions store={store} />
            </PanelSection>
          ),
        },
      ]
    }

    return [
      {
        key: "selection",
        title: "Selection",
        icon: SquareMousePointer,
        content: (
          <PanelSection title="Selection">
            <CompactActions store={store} />
          </PanelSection>
        ),
      },
    ]
  }

  const sections = getSections()
  const railItems: RailItemDescriptor[] =
    selectedType === "text" && !hasMixedSelection
      ? [
          {
            key: "font",
            title: "Font",
            icon: Type,
            render: (
              <TextFontFamilyControl
                elements={selectedElements}
                store={store}
                position={Position.LEFT_TOP}
                triggerText="Font"
                triggerIcon={<Type className="h-5 w-5" />}
                triggerClassName="right-context-drawer__nav-button right-context-drawer__nav-button--tool"
                showCaret={false}
                useActiveFontStyle={false}
                tooltipContent="Font"
                customTrigger
              />
            ),
          },
          {
            key: "colour",
            title: "Colour",
            icon: Type,
            render: (
              <TextColorMenuButton
                elements={selectedElements}
                store={store}
              />
            ),
          },
          {
            key: "align",
            title: "Align",
            icon: AlignLeft,
            onClick: () => {
              cycleAlign()
              setActiveSectionKey("typography")
              setIsOpen(true)
            },
          },
          {
            key: "ai",
            title: "AI",
            icon: Sparkles,
            render: (
              <TextAiMenuButton
                elements={selectedElements}
                store={store}
              />
            ),
          },
          {
            key: "bold",
            title: "Bold",
            icon: Bold,
            active:
              selectedElement?.fontWeight === "bold" ||
              selectedElement?.fontWeight === "700",
            onClick: () => {
              toggleTextProp("fontWeight", "bold", "normal")
              setActiveSectionKey("typography")
              setIsOpen(true)
            },
          },
          {
            key: "italic",
            title: "Italic",
            icon: Italic,
            active: selectedElement?.fontStyle === "italic",
            onClick: () => {
              toggleTextProp("fontStyle", "italic", "normal")
              setActiveSectionKey("typography")
              setIsOpen(true)
            },
          },
          {
            key: "underline",
            title: "Underline",
            icon: Underline,
            active: selectedElement?.textDecoration?.includes("underline"),
            onClick: () => {
              toggleUnderline()
              setActiveSectionKey("typography")
              setIsOpen(true)
            },
          },
          {
            key: "spacing",
            title: "Spacing",
            icon: SlidersHorizontal,
            render: (
              <TextSpacingMenuButton
                elements={selectedElements}
                store={store}
              />
            ),
          },
        ]
      : selectedType === "figure" && !hasMixedSelection
        ? [
            {
              key: "fill",
              title: "Fill",
              icon: Droplet,
              render: (
                <RailColorButton
                  label="Fill"
                  value={selectedElement?.fill || "#000000"}
                  store={store}
                  onChange={(color) =>
                    store.history.transaction(() => {
                      selectedElements.forEach((element: any) => {
                        element.set({ fill: color })
                      })
                    })
                  }
                />
              ),
            },
            ...(selectedElements.some((element: any) => element.strokeWidth)
              ? [
                  {
                    key: "stroke",
                    title: "Stroke",
                    icon: Droplet,
                    render: (
                      <RailColorButton
                        label="Stroke"
                        value={selectedElement?.stroke || "#000000"}
                        store={store}
                        onChange={(color) =>
                          store.history.transaction(() => {
                            selectedElements.forEach((element: any) => {
                              element.set({ stroke: color })
                            })
                          })
                        }
                      />
                    ),
                  },
                ]
              : []),
            {
              key: "border",
              title: "Border",
              icon: SlidersHorizontal,
              render: (
                <ShapeSettingsMenuButton elements={selectedElements} store={store} />
              ),
            },
          ]
        : selectedType === "svg" && !hasMixedSelection
          ? [
              {
                key: "colours",
                title: "Colours",
                icon: Droplet,
                render: (
                  <SvgColorsMenuButton element={selectedElement} store={store} />
                ),
              },
              {
                key: "flip",
                title: "Flip",
                icon: ImageIcon,
                render: <FlipMenuButton elements={selectedElements} />,
              },
              ...(selectedElements.every(isLinedWritingBox)
                ? [
                    {
                      key: "border",
                      title: "Border",
                      icon: SlidersHorizontal,
                      render: (
                        <LinedBorderStylePicker
                          elements={selectedElements}
                          store={store}
                          triggerClassName="right-context-drawer__nav-button right-context-drawer__nav-button--tool"
                          triggerLabel="Border"
                          triggerIcon={<SlidersHorizontal className="h-5 w-5" />}
                          customTrigger
                        />
                      ),
                    },
                  ]
                : []),
            ]
          : sections.map((section) => ({
              key: section.key,
              title: section.title,
              icon: section.icon,
              active: isOpen && activeSectionKey === section.key,
              onClick: () => {
                setActiveSectionKey(section.key)
                setIsOpen(true)
              },
            }))
  const activeSection =
    sections.find((section) => section.key === activeSectionKey) || sections[0]

  useEffect(() => {
    if (!sections.some((section) => section.key === activeSectionKey)) {
      setActiveSectionKey(sections[0]?.key || "")
    }
  }, [activeSectionKey, sections])

  const showPanel =
    isOpen &&
    selectedElements.length > 0 &&
    !(
      (selectedType === "text" || selectedType === "figure" || selectedType === "svg") &&
      !hasMixedSelection
    )

  return (
    <div
      ref={panelRef}
      className={`right-context-drawer${isOpen ? " right-context-drawer--open" : ""}`}
    >
      <div className="right-context-drawer__rail">
        <div className="right-context-drawer__nav">
          {railItems.map((item) => {
            if (item.render) {
              return (
                <div key={item.key} className="right-context-drawer__nav-item">
                  {item.render}
                </div>
              )
            }

            const Icon = item.icon
            const isActive = Boolean(item.active)

            return (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className={`right-context-drawer__nav-button${
                  isActive ? " right-context-drawer__nav-button--active" : ""
                }`}
                title={item.title}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="right-context-drawer__nav-label">
                  {item.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      {showPanel ? (
        <aside className="right-context-panel">
          <div className="right-context-panel__header">
            <div className="right-context-panel__header-copy">
              <div className="right-context-panel__eyebrow">Context</div>
              <div className="right-context-panel__title">{panelTitle}</div>
            </div>
            <button
              type="button"
              className="right-context-panel__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close edit panel"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="right-context-panel__content">
            {activeSection?.content}
          </div>
        </aside>
      ) : null}
    </div>
  )
})

export default RightContextPanel
