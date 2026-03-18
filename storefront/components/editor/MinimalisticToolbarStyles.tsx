"use client"
import { useEffect } from "react"

export const MinimalisticToolbarStyles = () => {
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .polotno-toolbar {
        padding: 8px 16px !important;
        min-height: 56px !important;
        display: flex !important;
        align-items: center !important;
        overflow-x: auto !important;
      }
      
      .polotno-toolbar .bp5-navbar-group {
        gap: 16px !important;
        display: flex !important;
        align-items: center !important;
        flex-shrink: 0 !important;
      }
      
      .polotno-toolbar .bp5-button {
        margin: 0 4px !important;
        flex-shrink: 0 !important;
      }
      
      .polotno-toolbar .bp5-popover-target {
        margin: 0 4px !important;
        flex-shrink: 0 !important;
      }
      
      .polotno-toolbar .bp5-html-select {
        margin: 0 8px !important;
        flex-shrink: 0 !important;
        min-width: fit-content !important;
      }
      
      .polotno-toolbar .bp5-numeric-input {
        margin: 0 8px !important;
        flex-shrink: 0 !important;
        width: 80px !important;
      }
      
      .polotno-toolbar .bp5-button-group {
        margin: 0 8px !important;
        flex-shrink: 0 !important;
        gap: 4px !important;
      }
      
      .polotno-toolbar .bp5-overflow-list {
        display: flex !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        gap: 8px !important;
      }
      
      .polotno-toolbar .bp5-navbar-group.bp5-align-left {
        width: 536px !important;
      }

      .polotno-toolbar .bp5-navbar-group.bp5-align-right {
        margin-left: auto !important;
      }

      
      /* Hide text labels in toolbar buttons, keep only icons */
      .polotno-toolbar .bp5-button .bp5-button-text {
        display: none !important;
      }
      
      /* Adjust button padding when text is hidden */
      .polotno-toolbar .bp5-button:has(.bp5-button-text) {
        padding: 6px !important;
      }

      /* Fix for font size input overlapping */
      .polotno-toolbar .bp5-input-group {
        margin: 0 !important;
        width: 100% !important;
      }

      /* Specific fixes for select and input contents */
      .polotno-toolbar .bp5-html-select select {
        min-width: 120px !important;
        height: 32px !important;
        padding-right: 28px !important;
      }

      .polotno-toolbar .bp5-numeric-input input {
        width: 70px !important;
        height: 32px !important;
      }

      /* Ensure color picker has a distinct size */
      .polotno-toolbar .bp5-popover-target .bp5-button {
          min-width: 32px !important;
          height: 32px !important;
      }


    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
