import { useState, useEffect } from "react"
import { Input, Button, Select, Switch, Textarea, toast } from "@medusajs/ui"
import { MediaType } from "../../types"

type CreateMedia = {
  type: MediaType
  file?: File
}

type Props = {
  onSuccess?: () => void
  currentUserId?: string // Optional prop to pass the current user's ID
}

const CreateTemplateForm = ({
  onSuccess,
  currentUserId
}: Props) => {
  const [name, setName] = useState("")
  const [medias, setMedias] = useState<CreateMedia[]>([])
  const [productTitle, setProductTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [templateData, setTemplateData] = useState("")
  const [creatorId, setCreatorId] = useState(currentUserId || "")
  const [isPremium, setIsPremium] = useState(false)
  // New state variables for additional fields
  const [categoryTop, setCategoryTop] = useState("")
  const [categorySub, setCategorySub] = useState("")
  const [tags, setTags] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [showInStudio, setShowInStudio] = useState(false)
  // State for category selection mode
  const [categoryTopMode, setCategoryTopMode] = useState<"select" | "add">("select")
  const [categorySubMode, setCategorySubMode] = useState<"select" | "add">("select")
  // State for available categories
  const [availableTopCategories, setAvailableTopCategories] = useState<string[]>([])
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([])

  // Fetch existing categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/admin/digital-products/categories", {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch categories")
        const { top_categories, sub_categories } = await res.json()
        setAvailableTopCategories(top_categories || [])
        setAvailableSubCategories(sub_categories || [])
      } catch (err) {
        console.error("Error fetching categories:", err)
        toast.error("Error", {
          description: "Failed to load categories"
        })
      }
    }
    fetchCategories()
  }, [])

  const onAddMedia = () => {
    setMedias((prev) => [
      ...prev,
      {
        type: MediaType.PREVIEW,
      }
    ])
  }

  const changeFiles = (
    index: number,
    data: Partial<CreateMedia>
  ) => {
    setMedias((prev) => [
      ...(prev.slice(0, index)),
      {
        ...prev[index],
        ...data
      },
      ...(prev.slice(index + 1))
    ])
  }

  const uploadMediaFiles = async (
    type: MediaType
  ) => {
    const formData = new FormData()
    const mediaWithFiles = medias.filter(
      (media) => media.file !== undefined && 
        media.type === type
    )

    if (!mediaWithFiles.length) {
      return
    }

    mediaWithFiles.forEach((media) => {
      if (!media.file) {
        return
      }
      formData.append("files", media.file)
    })

    const { files } = await fetch(`/admin/digital-products/upload/${type}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => res.json())

    return {
      mediaWithFiles,
      files
    }
  }

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      // Clear the URL input when file is selected
      setThumbnail("")
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload thumbnail if file is selected
      let thumbnailUrl = thumbnail // Use URL if provided
      if (thumbnailFile) {
        const thumbnailFormData = new FormData()
        thumbnailFormData.append("files", thumbnailFile)
        
        const thumbnailResponse = await fetch("/admin/digital-products/upload/preview", {
          method: "POST",
          credentials: "include",
          body: thumbnailFormData,
        })
        
        if (thumbnailResponse.ok) {
          const { files } = await thumbnailResponse.json()
          thumbnailUrl = files[0]?.url || thumbnail
        }
      }

      const {
        mediaWithFiles: previewMedias,
        files: previewFiles
      } = await uploadMediaFiles(MediaType.PREVIEW) || {}
      const {
        mediaWithFiles: mainMedias,
        files: mainFiles
      } = await uploadMediaFiles(MediaType.MAIN) || {}
  
      const mediaData: {
        type: MediaType
        file_id: string
        mime_type: string
      }[] = []
  
      previewMedias?.forEach((media, index) => {
        mediaData.push({
          type: media.type,
          file_id: previewFiles[index].id,
          mime_type: media.file!.type,
        })
      })
  
      mainMedias?.forEach((media, index) => {
        mediaData.push({
          type: media.type,
          file_id: mainFiles[index].id,
          mime_type: media.file!.type,
        })
      })
      
      // Parse template data as JSON if it's not empty
      let parsedTemplateData = null
      if (templateData) {
        try {
          parsedTemplateData = JSON.parse(templateData)
        } catch (error) {
          toast.error("Invalid JSON", {
            description: "Template data must be valid JSON"
          })
          setLoading(false)
          return
        }
      }

      // Parse tags as array if not empty
      let parsedTags = null
      if (tags) {
        try {
          const tagArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag)
          parsedTags = tagArray.length > 0 ? tagArray : null
        } catch (error) {
          toast.error("Invalid tags", {
            description: "Tags should be comma-separated values"
          })
          setLoading(false)
          return
        }
      }

      fetch(`/admin/digital-products`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          medias: mediaData,
          template_data: parsedTemplateData,
          creator_id: creatorId || null,
          is_premium: isPremium,
          category_top: categoryTop || null,
          category_sub: categorySub || null,
          tags: parsedTags,
          thumbnail: thumbnailUrl || null,
          show_in_studio: showInStudio,
          isTemplate: true, // Mark as template
          product: {
            title: productTitle,
            options: [{
              title: "Default",
              values: ["default"]
            }],
            variants: [{
              title: productTitle,
              options: {
                Default: "default"
              },
              prices: []
            }],
          }
        })
      })
      .then((res) => res.json())
      .then(({ message }) => {
        if (message) {
          throw message
        }
        toast.success("Success", {
          description: "Template created successfully"
        })
        onSuccess?.()
      })
      .catch((e) => {
        console.error(e)
        toast.error("Error", {
          description: `An error occurred while creating the template: ${e}`
        })
      })
      .finally(() => setLoading(false))
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <Input
            name="name"
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <fieldset className="mt-4">
          <legend className="mb-2 font-medium">Product Type</legend>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isPremium} 
              onCheckedChange={setIsPremium}
              id="premium-switch"
            />
            <label htmlFor="premium-switch">Premium Product</label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-medium">Top Category</legend>
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              checked={categoryTopMode === "select"}
              onCheckedChange={(checked) => setCategoryTopMode(checked ? "select" : "add")}
              id="category-top-mode"
            />
            <label htmlFor="category-top-mode">
              {categoryTopMode === "select" ? "Select Existing" : "Add New"}
            </label>
          </div>
          {categoryTopMode === "select" ? (
            <Select
              value={categoryTop}
              onValueChange={setCategoryTop}
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Select Top Category" />
              </Select.Trigger>
              <Select.Content>
                {availableTopCategories.map((cat) => (
                  <Select.Item key={cat} value={cat}>{cat}</Select.Item>
                ))}
              </Select.Content>
            </Select>
          ) : (
            <Input
              name="category_top"
              placeholder="New Top Category"
              type="text"
              value={categoryTop}
              onChange={(e) => setCategoryTop(e.target.value)}
            />
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-medium">Sub Category</legend>
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              checked={categorySubMode === "select"}
              onCheckedChange={(checked) => setCategorySubMode(checked ? "select" : "add")}
              id="category-sub-mode"
            />
            <label htmlFor="category-sub-mode">
              {categorySubMode === "select" ? "Select Existing" : "Add New"}
            </label>
          </div>
          {categorySubMode === "select" ? (
            <Select
              value={categorySub}
              onValueChange={setCategorySub}
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Select Sub Category" />
              </Select.Trigger>
              <Select.Content>
                {availableSubCategories.map((cat) => (
                  <Select.Item key={cat} value={cat}>{cat}</Select.Item>
                ))}
              </Select.Content>
            </Select>
          ) : (
            <Input
              name="category_sub"
              placeholder="New Sub Category"
              type="text"
              value={categorySub}
              onChange={(e) => setCategorySub(e.target.value)}
            />
          )}
        </fieldset>

        <div>
          <label className="block mb-1">Tags (comma-separated)</label>
          <Input
            name="tags"
            placeholder="e.g., design, template, digital"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Thumbnail</label>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Upload Image</label>
              <Input
                name="thumbnail_file"
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
              />
              {thumbnailPreview && (
                <div className="mt-2">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or enter URL</span>
              </div>
            </div>
            <div>
              <Input
                name="thumbnail"
                placeholder="https://example.com/thumbnail.jpg"
                type="url"
                value={thumbnail}
                onChange={(e) => {
                  setThumbnail(e.target.value)
                  setThumbnailFile(null)
                  setThumbnailPreview("")
                }}
                disabled={!!thumbnailFile}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1">Template Data (JSON)</label>
          <Textarea
            name="template_data"
            placeholder='{"key": "value"}'
            value={templateData}
            onChange={(e) => setTemplateData(e.target.value)}
            rows={4}
          />
        </div>

        <fieldset>
          <legend className="mb-2 font-medium">Visibility</legend>
          <div className="flex items-center space-x-2">
            <Switch
              checked={showInStudio}
              onCheckedChange={setShowInStudio}
              id="show-in-studio"
            />
            <label htmlFor="show-in-studio">Show in Studio</label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-medium">Media</legend>
          <Button type="button" onClick={onAddMedia} variant="secondary" className="mb-2">Add Media</Button>
          {medias.map((media, index) => (
            <fieldset key={index} className="my-2 p-2 border border-solid rounded">
              <legend className="text-sm">Media {index + 1}</legend>
              <Select 
                value={media.type} 
                onValueChange={(value) => changeFiles(
                  index,
                  {
                    type: value as MediaType
                  }
                )}
              >
                <Select.Trigger className="w-full mb-2">
                  <Select.Value placeholder="Media Type" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value={MediaType.PREVIEW}>
                    Preview
                  </Select.Item>
                  <Select.Item value={MediaType.MAIN}>
                    Main
                  </Select.Item>
                </Select.Content>
              </Select>
              <Input
                name={`file-${index}`}
                type="file"
                onChange={(e) => changeFiles(
                  index,
                  {
                    file: e.target.files?.[0]
                  }
                )}
                className="mt-2"
              />
            </fieldset>
          ))}
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-medium">Product</legend>
          <Input
            name="product_title"
            placeholder="Product Title"
            type="text"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            required
          />
        </fieldset>

        <Button 
          type="submit"
          isLoading={loading}
          className="mt-4"
        >
          Create
        </Button>
      </div>
    </form>
  )
}

export default CreateTemplateForm