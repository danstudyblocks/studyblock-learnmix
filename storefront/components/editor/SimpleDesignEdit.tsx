"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import Script from "next/script"
import { PolotnoContainer, SidePanelWrap } from "polotno"
import { createStore } from "polotno/model/store"
import { SimpleSidePanel } from "./SimpleSidePanel"
import { SimpleRightSidePanel, type DesignActionsRef } from "./SimpleRightSidePanel"
import { CustomWorkspace } from "./CustomWorkspace"
import Header from "./Header"
import { CookieConsentBanner } from "./CookieConsentBanner"
import type { WritingGuidePreset } from "./linedWritingBox"

// A3 at 96 DPI: 297mm × 420mm
const DEFAULT_CANVAS_WIDTH = 1123
const DEFAULT_CANVAS_HEIGHT = 1587

export const SimpleDesignEdit = ({ customer }: any) => {
  const designActionsRef = useRef<DesignActionsRef>(null)
  const handleDownload = useCallback(() => { designActionsRef.current?.download() }, [])
  const handleShare = useCallback(() => { designActionsRef.current?.share() }, [])
  const handlePrint = useCallback(() => { designActionsRef.current?.print() }, [])
  const handleAddToLearnmix = useCallback(() => { designActionsRef.current?.addToLearnmix() }, [])

  const [store] = useState(() => {
    const s = createStore({
      key: process.env.NEXT_PUBLIC_POLOTNO_API_KEY || "",
      showCredit: false,
    })
    s.addPage()
    s.setSize(DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT)
    return s
  })
  const [activeWritingGuide, setActiveWritingGuide] =
    useState<WritingGuidePreset | null>(null)

  const loadedFromStorage = useRef(false)
  useEffect(() => {
    if (loadedFromStorage.current) return
    const saved = localStorage.getItem("polotno-template")
    if (!saved) return
    loadedFromStorage.current = true
    try {
      const json = JSON.parse(saved)
      const template = {
        width: json.width ?? DEFAULT_CANVAS_WIDTH,
        height: json.height ?? DEFAULT_CANVAS_HEIGHT,
        unit: json.unit ?? "px",
        pages: Array.isArray(json.pages) ? json.pages : [{ id: "page1", children: [], width: json.width ?? DEFAULT_CANVAS_WIDTH, height: json.height ?? DEFAULT_CANVAS_HEIGHT, background: "white" }],
      }
      store.loadJSON(template)
    } catch (e) {
      console.error("Error loading template from localStorage:", e)
      loadedFromStorage.current = false
    }
  }, [store])
  
  return (
    <div className="h-screen flex flex-col bg-[#F5F2EE]">
      <Header
        customer={customer}
        store={store}
        onDownload={handleDownload}
        onShare={handleShare}
        onPrint={handlePrint}
        onAddToLearnmix={handleAddToLearnmix}
      />
      <div className="flex-1 flex overflow-hidden flex-col">
        <PolotnoContainer className="flex relative w-full flex-1">
          <SidePanelWrap className="w-[92px] min-w-[92px] border-r border-gray-200 flex-shrink-0 bg-[#F5F2EE]">
            <SimpleSidePanel
              store={store}
              customer={customer}
              onAddToLearnmix={handleAddToLearnmix}
              activeWritingGuide={activeWritingGuide}
              onActivateWritingGuideTool={setActiveWritingGuide}
              onDeactivateWritingGuideTool={() => setActiveWritingGuide(null)}
            />
          </SidePanelWrap>

          <CustomWorkspace
            store={store}
            activeWritingGuide={activeWritingGuide}
            onDeactivateWritingGuideTool={() => setActiveWritingGuide(null)}
          />

          {/* Actions + modals only (no visible sidebar); ref used by header buttons */}
          <SimpleRightSidePanel
            ref={designActionsRef}
            store={store}
            customer={customer}
            sidebar={false}
          />
        </PolotnoContainer>
      </div>
      <CookieConsentBanner />
      <div id="deployment-a5d8bc8c-7c2b-4ee2-b0cb-481a2fe78e4b"></div>
      <Script 
        src="https://studio.pickaxe.co/api/embed/bundle.js" 
        strategy="afterInteractive"
      />
    </div>
  )
}

export default SimpleDesignEdit
