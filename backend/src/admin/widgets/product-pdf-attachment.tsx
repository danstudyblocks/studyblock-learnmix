import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
import { Container, Heading, Button, Input, toast } from "@medusajs/ui"
import { Trash, ArrowDownTray } from "@medusajs/icons"

const ProductPdfAttachmentWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const [pdfAttachment, setPdfAttachment] = useState<{
    id: string
    file_id: string
    filename: string
    url: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchAttachment = () => {
    fetch(`/admin/products/${data.id}/pdf-attachment`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ attachment }) => {
        setPdfAttachment(attachment)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching PDF attachment:", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!loading) {
      return
    }
    fetchAttachment()
  }, [loading, data.id])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Only PDF files are allowed"
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`/admin/products/${data.id}/pdf-attachment`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      toast.success("Success", {
        description: "PDF attachment uploaded successfully"
      })
      setPdfAttachment(result.attachment)
    } catch (error) {
      console.error("Error uploading PDF:", error)
      toast.error("Upload failed", {
        description: error.message
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this PDF attachment?")) {
      return
    }

    try {
      const response = await fetch(`/admin/products/${data.id}/pdf-attachment`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      toast.success("Success", {
        description: "PDF attachment deleted successfully"
      })
      setPdfAttachment(null)
    } catch (error) {
      console.error("Error deleting PDF:", error)
      toast.error("Delete failed", {
        description: error.message
      })
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">PDF Attachment</Heading>
      </div>
      
      {loading ? (
        <div className="px-6 py-4">
          <span>Loading...</span>
        </div>
      ) : pdfAttachment ? (
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between p-4 border rounded">
            <div className="flex-1">
              <p className="font-medium">{pdfAttachment.filename}</p>
              <p className="text-sm text-gray-500">PDF Document</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => window.open(pdfAttachment.url, '_blank')}
              >
                <ArrowDownTray className="mr-1" />
                Download
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={handleDelete}
              >
                <Trash className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4 space-y-4">
          <p className="text-sm text-gray-500">
            Upload a PDF file that customers can download after purchase
          </p>
          <div>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
          {uploading && (
            <p className="text-sm text-gray-500">Uploading...</p>
          )}
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductPdfAttachmentWidget
