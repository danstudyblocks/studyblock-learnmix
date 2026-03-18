"use client"

export const TOOLBAR_CLOSE_POPOVERS_EVENT = "canvas-toolbar-close-popovers"

export function closeToolbarPopovers(except?: HTMLElement | null) {
  if (typeof document === "undefined") {
    return
  }

  const expandedTriggers = Array.from(
    document.querySelectorAll(
      ".canvas-context-toolbar [aria-expanded='true'], .canvas-context-toolbar .canvas-font-menu__trigger[aria-expanded='true']"
    )
  ) as HTMLElement[]

  expandedTriggers.forEach((trigger) => {
    if (except && (trigger === except || trigger.contains(except))) {
      return
    }

    trigger.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    )
  })

  document.dispatchEvent(
    new CustomEvent(TOOLBAR_CLOSE_POPOVERS_EVENT, {
      bubbles: true,
    })
  )

  const activeElement = document.activeElement as HTMLElement | null
  activeElement?.blur?.()

  const outsideTarget = document.body || document.documentElement
  if (!outsideTarget) {
    return
  }

  outsideTarget.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  )

  outsideTarget.dispatchEvent(
    new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  )
}
