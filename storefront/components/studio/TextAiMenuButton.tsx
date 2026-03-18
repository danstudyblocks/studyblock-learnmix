"use client"

import { useEffect, useMemo, useState } from "react"
import { InputGroup, Popover, Position, Spinner, Tooltip } from "@blueprintjs/core"
import { Languages, Sparkles } from "lucide-react"
import {
  closeToolbarPopovers,
  TOOLBAR_CLOSE_POPOVERS_EVENT,
} from "./toolbarPopoverUtils"

type TextAiAction = "rewrite" | "translate" | "differentiate"

const actionCopy: Record<
  TextAiAction,
  { label: string; description: string }
> = {
  rewrite: {
    label: "Rewrite",
    description: "Polish the selected text while keeping the meaning intact.",
  },
  translate: {
    label: "Translate",
    description: "Translate the selected text into the language you choose.",
  },
  differentiate: {
    label: "Differentiate",
    description: "Adapt the selected text for broader learner accessibility.",
  },
}

export default function TextAiMenuButton({
  elements,
  store,
}: {
  elements: any[]
  store: any
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("Spanish")
  const [rewriteAge, setRewriteAge] = useState("10")
  const [differentiateMode, setDifferentiateMode] = useState<
    "easier" | "harder" | "friendlier" | "more professional"
  >("easier")

  const activeElement = elements[0]
  const selectedText = useMemo(() => {
    const richText = activeElement?.metadata?.richText
    if (typeof richText === "string" && richText.trim()) {
      return richText
    }

    return typeof activeElement?.text === "string" ? activeElement.text : ""
  }, [activeElement?.metadata?.richText, activeElement?.text])

  const isDisabled = elements.length !== 1 || !selectedText.trim()

  useEffect(() => {
    const handleCloseAll = () => {
      setIsOpen(false)
    }

    document.addEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)

    return () => {
      document.removeEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)
    }
  }, [])

  const handleApply = async (action: TextAiAction) => {
    if (!activeElement || !selectedText.trim() || isLoading) {
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/text-transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          text: selectedText,
          targetLanguage,
          rewriteAge,
          differentiateMode,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || "AI text update failed.")
      }

      const content = String(payload?.content || "").trim()

      if (!content) {
        throw new Error("The AI returned an empty result.")
      }

      store.history.transaction(() => {
        activeElement.set({
          text: content,
          metadata: {
            ...(activeElement.metadata || {}),
            richText: content,
          },
        })
      })
    } catch (nextError: any) {
      setError(nextError?.message || "Unable to update the selected text.")
      return
    } finally {
      setIsLoading(false)
    }

    setIsOpen(false)
  }

  return (
    <Popover
      isOpen={isOpen}
      onInteraction={(nextOpenState) => setIsOpen(nextOpenState)}
      position={Position.LEFT_TOP}
      content={
        <div className="text-ai-menu">
          <div className="text-ai-menu__header">
            <div className="text-ai-menu__title">AI text tools</div>
            <div className="text-ai-menu__subtitle">
              Rewrite, translate, or adapt the selected text.
            </div>
          </div>

          <div className="text-ai-menu__actions">
            <div className="text-ai-menu__action">
              <div className="text-ai-menu__action-header">
                <div className="text-ai-menu__action-title">
                  {actionCopy.rewrite.label}
                </div>
                <div className="text-ai-menu__action-description">
                  {actionCopy.rewrite.description}
                </div>
              </div>
              <div className="text-ai-menu__field-label">Age</div>
              <InputGroup
                value={rewriteAge}
                onChange={(event) => setRewriteAge(event.currentTarget.value)}
                placeholder="10"
              />
              <button
                type="button"
                className="text-ai-menu__translate-button"
                onClick={() => handleApply("rewrite")}
                disabled={isLoading || !rewriteAge.trim()}
              >
                Rewrite
              </button>
            </div>

            <div className="text-ai-menu__action">
              <div className="text-ai-menu__action-header">
                <div className="text-ai-menu__action-title">
                  {actionCopy.differentiate.label}
                </div>
                <div className="text-ai-menu__action-description">
                  {actionCopy.differentiate.description}
                </div>
              </div>
              <div className="text-ai-menu__field-label">Style</div>
              <div className="text-ai-menu__option-grid">
                {(
                  [
                    "easier",
                    "harder",
                    "friendlier",
                    "more professional",
                  ] as const
                ).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`text-ai-menu__option${
                      differentiateMode === option
                        ? " text-ai-menu__option--active"
                        : ""
                    }`}
                    onClick={() => setDifferentiateMode(option)}
                    disabled={isLoading}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="text-ai-menu__translate-button"
                onClick={() => handleApply("differentiate")}
                disabled={isLoading}
              >
                Differentiate
              </button>
            </div>
          </div>

          <div className="text-ai-menu__translate">
            <div className="text-ai-menu__field-label">Translate to</div>
            <div className="text-ai-menu__translate-row">
              <InputGroup
                value={targetLanguage}
                onChange={(event) => setTargetLanguage(event.currentTarget.value)}
                placeholder="Spanish"
                leftIcon={<Languages className="h-4 w-4" />}
              />
            </div>
            <button
              type="button"
              className="text-ai-menu__translate-button"
              onClick={() => handleApply("translate")}
              disabled={isLoading || !targetLanguage.trim()}
            >
              Translate
            </button>
          </div>

          {isLoading ? (
            <div className="text-ai-menu__status">
              <Spinner size={16} />
              <span>Updating selected text…</span>
            </div>
          ) : null}

          {error ? <div className="text-ai-menu__error">{error}</div> : null}
        </div>
      }
    >
      <Tooltip
        content={
          isDisabled ? "Select a single text box to use AI tools" : "AI text tools"
        }
        position={Position.LEFT}
      >
        <button
          type="button"
          disabled={isDisabled}
          aria-label="AI text tools"
          aria-expanded={isOpen}
          className={`right-context-drawer__nav-button right-context-drawer__nav-button--tool${
            isOpen ? " right-context-drawer__nav-button--active" : ""
          }`}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            if (isDisabled) {
              return
            }

            if (isOpen) {
              setIsOpen(false)
              return
            }

            closeToolbarPopovers(event.currentTarget)
            window.setTimeout(() => {
              setIsOpen(true)
            }, 0)
          }}
        >
          <span className="right-context-drawer__nav-icon">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="right-context-drawer__nav-label">AI</span>
        </button>
      </Tooltip>
    </Popover>
  )
}
