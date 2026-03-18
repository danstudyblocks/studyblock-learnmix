"use client"

import { type ReactNode, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import {
  Button,
  InputGroup,
  Menu,
  MenuItem,
  Popover,
  Position,
  Tooltip,
} from "@blueprintjs/core"
import { CaretDown, Search } from "@blueprintjs/icons"
import { getGoogleFontsListAPI } from "polotno/utils/api"
import {
  getFontsList,
  globalFonts,
  isGoogleFontChanged,
} from "polotno/utils/fonts"
import { t } from "polotno/utils/l10n"
import {
  closeToolbarPopovers,
  TOOLBAR_CLOSE_POPOVERS_EVENT,
} from "./toolbarPopoverUtils"

const fallbackFonts = getFontsList()

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export default function TextFontFamilyControl({
  elements,
  store,
  position = Position.BOTTOM,
  triggerText,
  triggerIcon,
  triggerClassName = "",
  showCaret = true,
  useActiveFontStyle = true,
  tooltipContent,
  customTrigger = false,
}: {
  elements: any[]
  store: any
  position?: Position
  triggerText?: string
  triggerIcon?: ReactNode
  triggerClassName?: string
  showCaret?: boolean
  useActiveFontStyle?: boolean
  tooltipContent?: ReactNode
  customTrigger?: boolean
}) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { data } = useSWR(getGoogleFontsListAPI(), fetcher, {
    isPaused: () => isGoogleFontChanged(),
    fallbackData: [],
  })

  const activeFont = elements[0]?.fontFamily || "Roboto"
  const activeFontLabel =
    activeFont.length > 15 ? `${activeFont.slice(0, 15)}...` : activeFont

  const fonts = useMemo(() => {
    const localFonts = store.fonts
      .concat(globalFonts)
      .map((font: { fontFamily: string }) => font.fontFamily)

    const remoteFonts =
      Array.isArray(data) && !isGoogleFontChanged() && data.length > 0
        ? data
        : fallbackFonts

    return Array.from(new Set([...localFonts, ...remoteFonts]))
  }, [data, store.fonts])

  const filteredFonts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return fonts
    }

    return fonts.filter((font) => font.toLowerCase().includes(normalizedQuery))
  }, [fonts, query])

  useEffect(() => {
    const handleCloseAll = () => {
      setIsOpen(false)
    }

    document.addEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)

    return () => {
      document.removeEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)
    }
  }, [])

  const handleTriggerClick = (event: any) => {
    event.preventDefault()
    event.stopPropagation()

    if (isOpen) {
      setIsOpen(false)
      return
    }

    closeToolbarPopovers(event.currentTarget)

    window.setTimeout(() => {
      setIsOpen(true)
    }, 0)
  }

  return (
    <Popover
      isOpen={isOpen}
      onInteraction={(nextOpenState) => {
        setIsOpen(nextOpenState)
      }}
      position={position}
      content={
        <div className="canvas-font-menu">
          <InputGroup
            leftIcon={<Search />}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          <div className="canvas-font-menu__list">
            <Menu>
              {filteredFonts.map((font) => (
                <MenuItem
                  key={font}
                  text={
                    <span
                      className="canvas-font-menu__item-label"
                      style={{ fontFamily: `"${font}"` }}
                    >
                      {font}
                    </span>
                  }
                  active={activeFont === font}
                  onClick={async () => {
                    if (store.loadFont) {
                      await store.loadFont(font)
                    }

                    store.history.transaction(() => {
                      elements.forEach((element) => {
                        element.set({ fontFamily: font })
                      })
                    })

                    setIsOpen(false)
                  }}
                />
              ))}
            </Menu>
          </div>
        </div>
      }
    >
      <Tooltip
        content={tooltipContent ?? t("toolbar.fontFamily")}
        position={Position.BOTTOM}
      >
        {customTrigger ? (
          <button
            type="button"
            aria-label={t("toolbar.fontFamily")}
            aria-expanded={isOpen}
            className={triggerClassName}
            onClick={handleTriggerClick}
            style={{
              fontFamily: useActiveFontStyle ? `"${activeFont}"` : undefined,
            }}
          >
            {triggerIcon ? (
              <span className="right-context-drawer__nav-icon">{triggerIcon}</span>
            ) : null}
            <span className="right-context-drawer__nav-label">
              {triggerText ?? activeFontLabel}
            </span>
            {showCaret ? <CaretDown className="h-4 w-4" /> : null}
          </button>
        ) : (
          <Button
            minimal
            icon={triggerIcon}
            rightIcon={showCaret ? <CaretDown /> : undefined}
            aria-label={t("toolbar.fontFamily")}
            aria-expanded={isOpen}
            className={`canvas-font-menu__trigger ${triggerClassName}`.trim()}
            onClick={handleTriggerClick}
            style={{
              marginRight: "5px",
              fontFamily: useActiveFontStyle ? `"${activeFont}"` : undefined,
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxHeight: "30px",
            }}
            text={triggerText ?? activeFontLabel}
          />
        )}
      </Tooltip>
    </Popover>
  )
}
