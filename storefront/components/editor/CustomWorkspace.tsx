"use client"

import { type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react"
import { reaction } from "mobx"
import { observer } from "mobx-react-lite"
import { unstable_registerTransformerAttrs } from "polotno/config"
import { Workspace } from "polotno/canvas/workspace"
import { WorkspaceWrap } from "polotno"
import { Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react"
import RightContextPanel from "../studio/RightContextPanel"
import {
  createWritingGuideSvg,
  getWritingGuidePreset,
  serializeWritingGuidePreset,
  type WritingGuidePreset,
} from "./linedWritingBox"

let linedWritingTransformerRegistered = false

if (!linedWritingTransformerRegistered) {
  unstable_registerTransformerAttrs("svg", {
    enabledAnchors: [
      "top-left",
      "top-center",
      "top-right",
      "middle-left",
      "middle-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ],
  })
  linedWritingTransformerRegistered = true
}

type DrawState = {
  id: number
  pageRect: DOMRect
  startClientX: number
  startClientY: number
  currentClientX: number
  currentClientY: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const addLinedWritingBox = ({
  store,
  page,
  pageRect,
  startClientX,
  startClientY,
  endClientX,
  endClientY,
  preset,
}: {
  store: any
  page: any
  pageRect: DOMRect
  startClientX: number
  startClientY: number
  endClientX: number
  endClientY: number
  preset: WritingGuidePreset
}) => {
  const pageWidth = page?.computedWidth || store.width || 1
  const pageHeight = page?.computedHeight || store.height || 1

  const left = Math.min(startClientX, endClientX)
  const top = Math.min(startClientY, endClientY)
  const right = Math.max(startClientX, endClientX)
  const bottom = Math.max(startClientY, endClientY)

  const width = right - left
  const height = bottom - top

  if (width < 36 || height < 36) {
    return null
  }

  const x = ((left - pageRect.left) / pageRect.width) * pageWidth
  const y = ((top - pageRect.top) / pageRect.height) * pageHeight
  const boxWidth = (width / pageRect.width) * pageWidth
  const boxHeight = (height / pageRect.height) * pageHeight
  const normalizedWidth = Math.max(boxWidth, 60)
  const normalizedHeight = Math.max(boxHeight, 60)

  const element = page.addElement({
    type: "svg",
    name: serializeWritingGuidePreset(preset),
    borderSize: 2,
    cornerRadius: 18,
    keepRatio: false,
    stretchEnabled: true,
    resizable: true,
    src: createWritingGuideSvg({
      width: Math.max(Math.round(normalizedWidth), 60),
      height: Math.max(Math.round(normalizedHeight), 60),
      kind: preset.kind,
      spacingMm: preset.spacingMm,
      borderSize: 2,
      cornerRadius: 18,
    }),
    x,
    y,
    width: normalizedWidth,
    height: normalizedHeight,
  })

  const enforceDrawnSize = () => {
    element?.set({
      x,
      y,
      width: normalizedWidth,
      height: normalizedHeight,
      keepRatio: false,
      stretchEnabled: true,
    })
  }

  enforceDrawnSize()
  window.requestAnimationFrame(enforceDrawnSize)
  window.setTimeout(enforceDrawnSize, 80)

  return element
}

export const CustomWorkspace = observer(
  ({
    store,
    activeWritingGuide,
    onDeactivateWritingGuideTool,
  }: {
    store: any
    activeWritingGuide: WritingGuidePreset | null
    onDeactivateWritingGuideTool: () => void
  }) => {
    const workspaceRef = useRef<HTMLDivElement | null>(null)
    const [drawState, setDrawState] = useState<DrawState | null>(null)
    const [isWritingGuideArmed, setIsWritingGuideArmed] = useState(false)
    const drawSessionRef = useRef(0)
    const drawCommittedRef = useRef(false)
    const currentScale = store?.scale || 1

    if (!store) {
      return <div className="flex flex-col flex-1 min-w-0 h-full relative overflow-hidden bg-[#F5F2EE]" />
    }

    useEffect(() => {
      document.body.classList.add("editor-no-tooltips")

      return () => {
        document.body.classList.remove("editor-no-tooltips")
      }
    }, [])

    useEffect(() => {
      setIsWritingGuideArmed(Boolean(activeWritingGuide))

      if (!activeWritingGuide) {
        setDrawState(null)
      }
    }, [activeWritingGuide])

    useEffect(() => {
      const workspaceNode = workspaceRef.current?.querySelector(
        ".polotno-workspace-inner"
      ) as HTMLElement | null

      if (!workspaceNode) {
        return
      }

      const handleWorkspacePointerDown = (event: PointerEvent) => {
        const target = event.target as HTMLElement | null

        if (!target) {
          return
        }

        if (
          target.closest(".polotno-page-container") ||
          target.closest(".bp5-popover") ||
          target.closest(".bp5-portal") ||
          target.closest(".right-context-drawer") ||
          target.closest(".pointer-events-auto")
        ) {
          return
        }

        if (store.selectedElements.length) {
          store.selectElements([])
        }
      }

      workspaceNode.addEventListener("pointerdown", handleWorkspacePointerDown)

      return () => {
        workspaceNode.removeEventListener(
          "pointerdown",
          handleWorkspacePointerDown
        )
      }
    }, [store])

    useEffect(() => {
      const centerActivePage = () => {
        const workspaceNode = workspaceRef.current?.querySelector(
          ".polotno-workspace-inner"
        ) as HTMLElement | null
        const activePageNode = workspaceRef.current?.querySelector(
          ".polotno-page-container.active-page"
        ) as HTMLElement | null
        const rightRailNode = workspaceRef.current?.querySelector(
          ".right-context-drawer__rail"
        ) as HTMLElement | null

        if (!workspaceNode || !activePageNode) {
          return
        }

        const workspaceRect = workspaceNode.getBoundingClientRect()
        const activePageRect = activePageNode.getBoundingClientRect()
        const rightInset = rightRailNode?.offsetWidth || 0
        const visibleWidth = workspaceNode.clientWidth - rightInset
        const visibleHeight = workspaceNode.clientHeight

        const targetVisibleCenterX = visibleWidth / 2
        const targetVisibleCenterY = visibleHeight / 2

        const nextScrollLeft =
          workspaceNode.scrollLeft +
          (activePageRect.left - workspaceRect.left) -
          (targetVisibleCenterX - activePageRect.width / 2)

        const nextScrollTop =
          workspaceNode.scrollTop +
          (activePageRect.top - workspaceRect.top) -
          (targetVisibleCenterY - activePageRect.height / 2)

        workspaceNode.scrollTo({
          left: Math.max(nextScrollLeft, 0),
          top: Math.max(nextScrollTop, 0),
          behavior: "auto",
        })
      }

      const rafId = window.requestAnimationFrame(centerActivePage)
      const timeoutId = window.setTimeout(centerActivePage, 80)

      window.addEventListener("resize", centerActivePage)

      return () => {
        window.cancelAnimationFrame(rafId)
        window.clearTimeout(timeoutId)
        window.removeEventListener("resize", centerActivePage)
      }
    }, [store.activePage?.id, store.pages.length, currentScale])

    useEffect(() => {
      return reaction(
        () =>
          store.pages.flatMap((page: any) =>
            (page.children || []).map((element: any) => ({
              id: element.id,
              type: element.type,
              name: element.name,
              width: Math.round(element.width || 0),
              height: Math.round(element.height || 0),
              scaleX: Number(element.scaleX || 1),
              scaleY: Number(element.scaleY || 1),
              borderSize: Number(element.borderSize || 0),
              cornerRadius: Number(element.cornerRadius || 0),
            }))
          ),
        (elements) => {
          elements.forEach(({ id, type }) => {
            if (type !== "svg") {
              return
            }

            const element = store.getElementById(id)
            const preset = getWritingGuidePreset(element)

            if (!element || !preset) {
              return
            }

            const scaleX = Number(element.scaleX || 1)
            const scaleY = Number(element.scaleY || 1)
            const width = Math.max(
              Math.round((element.width || 0) * scaleX),
              60
            )
            const height = Math.max(
              Math.round((element.height || 0) * scaleY),
              60
            )
            const borderSize = Math.max(Number(element.borderSize || 2), 0)
            const cornerRadius = Math.max(Number(element.cornerRadius ?? 18), 0)
            const nextSrc = createWritingGuideSvg({
              width,
              height,
              kind: preset.kind,
              spacingMm: preset.spacingMm,
              borderSize,
              cornerRadius,
            })

            if (
              element.src !== nextSrc ||
              Math.abs(scaleX - 1) > 0.001 ||
              Math.abs(scaleY - 1) > 0.001 ||
              Math.round(element.width || 0) !== width ||
              Math.round(element.height || 0) !== height
            ) {
              element.set({
                width,
                height,
                scaleX: 1,
                scaleY: 1,
                keepRatio: false,
                stretchEnabled: true,
                src: nextSrc,
              })
            }
          })
        }
      )
    }, [store])

    useEffect(() => {
      if (!activeWritingGuide || !isWritingGuideArmed || !drawState) {
        return
      }

      const handlePointerMove = (event: PointerEvent) => {
        setDrawState((current) => {
          if (!current) {
            return current
          }

          return {
            ...current,
            currentClientX: clamp(
              event.clientX,
              current.pageRect.left,
              current.pageRect.right
            ),
            currentClientY: clamp(
              event.clientY,
              current.pageRect.top,
              current.pageRect.bottom
            ),
          }
        })
      }

      const handlePointerUp = (event: PointerEvent) => {
        setDrawState((current) => {
          if (!current || !activeWritingGuide) {
            return null
          }

          if (drawCommittedRef.current) {
            return null
          }

          drawCommittedRef.current = true

          const element = addLinedWritingBox({
            store,
            page: store.activePage,
            pageRect: current.pageRect,
            startClientX: current.startClientX,
            startClientY: current.startClientY,
            endClientX: clamp(
              event.clientX,
              current.pageRect.left,
              current.pageRect.right
            ),
            endClientY: clamp(
              event.clientY,
              current.pageRect.top,
              current.pageRect.bottom
            ),
            preset: activeWritingGuide,
          })

          if (element) {
            setIsWritingGuideArmed(false)
            store.selectElements([element])
            onDeactivateWritingGuideTool()
          }

          return null
        })
      }

      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp, { once: true })

      return () => {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
      }
    }, [
      activeWritingGuide,
      drawState,
      isWritingGuideArmed,
      onDeactivateWritingGuideTool,
      store,
    ])

    const previewStyle = useMemo(() => {
      if (!drawState) {
        return null
      }

      const left = Math.min(drawState.startClientX, drawState.currentClientX)
      const top = Math.min(drawState.startClientY, drawState.currentClientY)
      const width = Math.abs(drawState.currentClientX - drawState.startClientX)
      const height = Math.abs(drawState.currentClientY - drawState.startClientY)

      return {
        left,
        top,
        width,
        height,
      }
    }, [drawState])

    const handleZoomIn = () => {
      store.setScale(Math.min(currentScale + 0.1, 3))
    }

    const handleZoomOut = () => {
      store.setScale(Math.max(currentScale - 0.1, 0.1))
    }

    const handleUndo = () => {
      if (store.history.canUndo) {
        store.history.undo()
      }
    }

    const handleRedo = () => {
      if (store.history.canRedo) {
        store.history.redo()
      }
    }

    const handleOverlayPointerDown = (
      event: ReactPointerEvent<HTMLDivElement>
    ) => {
      if (!activeWritingGuide || !isWritingGuideArmed) {
        return
      }

      const pageNode = document.querySelector(
        ".polotno-page-container.active-page"
      ) as HTMLElement | null

      if (!pageNode) {
        return
      }

      const pageRect = pageNode.getBoundingClientRect()
      const startClientX = clamp(
        event.clientX,
        pageRect.left,
        pageRect.right
      )
      const startClientY = clamp(
        event.clientY,
        pageRect.top,
        pageRect.bottom
      )

      const isInsidePage =
        event.clientX >= pageRect.left &&
        event.clientX <= pageRect.right &&
        event.clientY >= pageRect.top &&
        event.clientY <= pageRect.bottom

      if (!isInsidePage) {
        return
      }

      event.preventDefault()
      drawSessionRef.current += 1
      drawCommittedRef.current = false
      setDrawState({
        id: drawSessionRef.current,
        pageRect,
        startClientX,
        startClientY,
        currentClientX: startClientX,
        currentClientY: startClientY,
      })
    }

    return (
      <div
        ref={workspaceRef}
        className={`custom-editor-workspace ${
          store.pages.length > 1 ? "custom-editor-workspace--multi-page" : "custom-editor-workspace--single-page"
        } flex flex-col flex-1 min-w-0 h-full relative overflow-hidden bg-[#F5F2EE]`}
      >
        <WorkspaceWrap className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 relative min-h-0">
            <Workspace
              store={store}
              layout="horizontal"
              backgroundColor="#F5F2EE"
            />

            <div className="pointer-events-none absolute bottom-4 left-4 z-20">
              <div className="pointer-events-auto flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!store.history.canUndo}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#171717] bg-[#FCFAF8] text-[#171717] shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Undo"
                  title="Undo"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={!store.history.canRedo}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#171717] bg-[#FCFAF8] text-[#171717] shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Redo"
                  title="Redo"
                >
                  <Redo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#171717] bg-[#FCFAF8] text-[#171717] shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition hover:bg-white"
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#171717] bg-[#FCFAF8] text-[#171717] shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition hover:bg-white"
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
              </div>
            </div>

            <RightContextPanel store={store} />

            {activeWritingGuide && isWritingGuideArmed ? (
              <div
                className="absolute inset-0 z-20"
                style={{ cursor: "crosshair" }}
                onPointerDown={handleOverlayPointerDown}
              >
                <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-[#171717] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                  Draw {activeWritingGuide.kind}: {activeWritingGuide.spacingMm}mm
                </div>
              </div>
            ) : null}

            {previewStyle ? (
              <div
                className="pointer-events-none fixed z-30 rounded-[18px] border-2 border-[#171717] bg-[rgba(255,255,255,0.35)]"
                style={previewStyle}
              />
            ) : null}
          </div>
        </WorkspaceWrap>
      </div>
    )
  }
)
