"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Link from "@tiptap/extension-link"
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react"

interface RichTextEditorProps {
  store: any
  element?: any
  onUpdate?: (html: string) => void
}

export const RichTextEditor = observer(
  ({ store, element, onUpdate }: RichTextEditorProps) => {
    const [isMounted, setIsMounted] = useState(false)

    // Ensure we're on the client side before initializing the editor
    useEffect(() => {
      setIsMounted(true)
    }, [])

    const editor = useEditor(
      {
        extensions: [
          StarterKit.configure({
            heading: {
              levels: [1, 2, 3],
            },
          }),
          Underline,
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
          TextStyle,
          Color,
          Link.configure({
            openOnClick: false,
            HTMLAttributes: {
              class: "text-blue-600 underline",
            },
          }),
        ],
        content: element?.text || "",
        immediatelyRender: false, // Prevent SSR hydration mismatches
        onUpdate: ({ editor }) => {
          const html = editor.getHTML()
          // Only call the onUpdate callback, don't directly update Polotno elements here
          // This avoids conflicts with Polotno's internal state management
          if (onUpdate) {
            onUpdate(html)
          }
        },
      },
      [isMounted, element?.id] // Only create editor when mounted and element changes
    )

    useEffect(() => {
      if (editor && element) {
        try {
          const richText = element.metadata?.richText || element.text || ""
          if (richText && editor.commands) {
            // Only update if content is different to avoid infinite loops
            const currentContent = editor.getHTML()
            if (currentContent !== richText) {
              editor.commands.setContent(richText)
            }
          }
        } catch (error) {
          console.error("Error setting editor content:", error)
        }
      }
    }, [editor, element?.id]) // Use element.id instead of element to avoid unnecessary re-renders

    // Don't render until mounted on client side
    if (!isMounted || !editor) {
      return (
        <div className="rich-text-editor border border-gray-300 rounded-lg bg-white shadow-lg p-4">
          <div className="text-sm text-gray-500">Loading editor...</div>
        </div>
      )
    }

    const MenuBar = () => (
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-200 bg-white rounded-t-lg">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bold") ? "bg-blue-100 text-blue-600" : ""
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("italic") ? "bg-blue-100 text-blue-600" : ""
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("underline") ? "bg-blue-100 text-blue-600" : ""
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("strike") ? "bg-blue-100 text-blue-600" : ""
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "left" })
                ? "bg-blue-100 text-blue-600"
                : ""
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "center" })
                ? "bg-blue-100 text-blue-600"
                : ""
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "right" })
                ? "bg-blue-100 text-blue-600"
                : ""
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "justify" })
                ? "bg-blue-100 text-blue-600"
                : ""
            }`}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bulletList") ? "bg-blue-100 text-blue-600" : ""
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("orderedList") ? "bg-blue-100 text-blue-600" : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 text-sm font-bold ${
              editor.isActive("heading", { level: 1 })
                ? "bg-blue-100 text-blue-600"
                : ""
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 text-sm font-bold ${
              editor.isActive("heading", { level: 2 })
                ? "bg-blue-100 text-blue-600"
                : ""
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 text-sm font-bold ${
              editor.isActive("heading", { level: 3 })
                ? "bg-blue-100 text-blue-600"
                : ""
            }`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        {/* Color Picker */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <input
            type="color"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            title="Text Color"
          />
        </div>

        {/* Link */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const url = window.prompt("Enter URL:")
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("link") ? "bg-blue-100 text-blue-600" : ""
            }`}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    )

    return (
      <div className="rich-text-editor border border-gray-300 rounded-lg bg-white shadow-lg">
        <MenuBar />
        <div className="p-4">
          <EditorContent editor={editor} className="focus:outline-none" />
        </div>
      </div>
    )
  }
)
