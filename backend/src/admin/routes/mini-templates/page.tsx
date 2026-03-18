import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PhotoSolid, MagnifyingGlass } from "@medusajs/icons"
import {
  Button,
  Container,
  Drawer,
  Heading,
  IconButton,
  Input,
  Table,
  Toaster,
  toast,
} from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
// @ts-ignore
import { debounce } from "lodash"
import CreateDigitalProductForm from "../../components/create-template-form"
import EditTemplateForm from "../../components/edit-template-form"

const MiniTemplatesPage = () => {
  const [miniTemplates, setMiniTemplates] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [inputValue, setInputValue] = useState("")

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value)
      }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSetSearchQuery(value)
  }

  const fetchMiniTemplates = async () => {
    try {
      const res = await fetch(`/mini-templates/list`, {
        credentials: "include",
      })
      if (!res.ok) {
        throw new Error("Failed to fetch mini templates")
      }
      const data = await res.json()
      setMiniTemplates(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching mini templates:", err)
      // @ts-ignore
      toast.error("Error fetching mini templates", {
        // @ts-ignore
        description: err.message,
      })
    }
  }

  const filteredTemplates = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      return miniTemplates
    }
    const lowerQuery = searchQuery.toLowerCase()
    return miniTemplates.filter(
      (template) =>
        template.name?.toLowerCase().includes(lowerQuery) ||
        template.category_top?.toLowerCase().includes(lowerQuery) ||
        template.category_sub?.toLowerCase().includes(lowerQuery) ||
        template.tags?.some((tag: string) =>
          tag?.toLowerCase?.()?.includes(lowerQuery)
        )
    )
  }, [miniTemplates, searchQuery])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mini template?")) {
      return
    }

    try {
      const res = await fetch(`/admin/digital-products/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to delete mini template")
      }
      toast.success("Mini template deleted successfully")
      fetchMiniTemplates()
    } catch (err) {
      console.error("Error deleting mini template:", err)
      // @ts-ignore
      toast.error("Error deleting mini template", {
        // @ts-ignore
        description: err.message,
      })
    }
  }

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/admin/digital-products/${id}`, {
        credentials: "include",
      })
      if (!res.ok) {
        throw new Error("Failed to fetch mini template")
      }
      const { digital_product } = await res.json()
      setSelectedTemplate(digital_product)
      setIsEditing(true)
      setOpen(true)
    } catch (err) {
      console.error("Error fetching mini template for edit:", err)
      // @ts-ignore
      toast.error("Error loading mini template", {
        // @ts-ignore
        description: err.message,
      })
    }
  }

  const handleCloseDrawer = () => {
    setOpen(false)
    setIsEditing(false)
    setSelectedTemplate(null)
  }

  useEffect(() => {
    fetchMiniTemplates()
  }, [])

  return (
    <Container>
      <Toaster />
      <div className="mb-4 flex items-center justify-between">
        <Heading level="h2">Mini Templates</Heading>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search mini templates..."
              value={inputValue}
              onChange={handleSearchChange}
              className="w-64 pr-10"
            />
            <IconButton
              variant="transparent"
              className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            >
              <MagnifyingGlass />
            </IconButton>
          </div>
          <Drawer open={open} onOpenChange={setOpen}>
            <Drawer.Trigger
              onClick={() => {
                setIsEditing(false)
                setSelectedTemplate(null)
                setOpen(true)
              }}
              asChild
            >
              <Button>Create</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>
                  {isEditing ? "Edit Mini Template" : "Create Mini Template"}
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body className="overflow-auto">
                {isEditing && selectedTemplate ? (
                  <EditTemplateForm
                    initialData={{
                      id: selectedTemplate.id,
                      name: selectedTemplate.name,
                      creator_id: selectedTemplate.creator_id,
                      is_premium: selectedTemplate.is_premium,
                      isTemplate: selectedTemplate.isTemplate,
                      show_in_studio: selectedTemplate.show_in_studio,
                      category_top: selectedTemplate.category_top,
                      category_sub: selectedTemplate.category_sub,
                      tags: selectedTemplate.tags,
                      thumbnail: selectedTemplate.thumbnail,
                      medias: selectedTemplate.medias,
                      template_data: selectedTemplate.template_data,
                      product: {
                        title: selectedTemplate.product?.title || "",
                      },
                    }}
                    onSuccess={() => {
                      handleCloseDrawer()
                      fetchMiniTemplates()
                    }}
                  />
                ) : (
                  <CreateDigitalProductForm
                    onSuccess={() => {
                      handleCloseDrawer()
                      fetchMiniTemplates()
                    }}
                  />
                )}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
        </div>
      </div>
      {filteredTemplates.length > 0 ? (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Thumbnail</Table.HeaderCell>
              <Table.HeaderCell>Top Category</Table.HeaderCell>
              <Table.HeaderCell>Sub Category</Table.HeaderCell>
              <Table.HeaderCell>Tags</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredTemplates.map((miniTemplate) => (
              <Table.Row key={miniTemplate.id}>
                <Table.Cell>{miniTemplate.name}</Table.Cell>
                <Table.Cell>
                  {miniTemplate.thumbnail ? (
                    <img
                      src={miniTemplate.thumbnail}
                      alt="Thumbnail"
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                  ) : (
                    <span>No thumbnail</span>
                  )}
                </Table.Cell>
                <Table.Cell>{miniTemplate.category_top || "N/A"}</Table.Cell>
                <Table.Cell>{miniTemplate.category_sub || "N/A"}</Table.Cell>
                <Table.Cell>
                  {miniTemplate.tags?.length > 0
                    ? miniTemplate.tags.join(", ")
                    : "No tags"}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(miniTemplate.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(miniTemplate.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>No mini templates found.</p>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Mini Templates",
  icon: PhotoSolid,
})

export default MiniTemplatesPage

