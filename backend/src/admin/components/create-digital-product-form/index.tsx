import { useState } from "react"
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

const CreateDigitalProductForm = ({
  onSuccess,
  currentUserId
}: Props) => {
  const [name, setName] = useState("")
  const [medias, setMedias] = useState<CreateMedia[]>([])
  const [productTitle, setProductTitle] = useState("")
  const [loading, setLoading] = useState(false)
  
  // New state variables for the missing fields
  const [templateData, setTemplateData] = useState("")
  const [creatorId, setCreatorId] = useState(currentUserId || "")
  const [isPremium, setIsPremium] = useState(false)
  const [price, setPrice] = useState<string>("")

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Validate price if product is premium
    if (isPremium && (!price || isNaN(parseFloat(price)))) {
      toast.error("Invalid price", {
        description: "Price is required for premium products"
      })
      setLoading(false)
      return
    }

    try {
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

      fetch(`/admin/digital-products`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          medias: mediaData,
          // Add the missing fields here
          template_data: parsedTemplateData,
          creator_id: creatorId || null,
          is_premium: isPremium,
          price: isPremium ? parseFloat(price) : null,
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
              // delegate setting the prices to the
              // product's page.
              prices: []
            }],
            // shipping_profile_id: ""
          }
        })
      })
      .then((res) => res.json())
      .then(({ message }) => {
        if (message) {
          throw message
        }
        toast.success("Success", {
          description: "Digital product created successfully"
        })
        onSuccess?.()
      })
      .catch((e) => {
        console.error(e)
        toast.error("Error", {
          description: `An error occurred while creating the digital product: ${e}`
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
          
          {isPremium && (
            <div className="mt-2">
              <label className="block mb-1">Price</label>
              <Input
                name="price"
                placeholder="Price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required={isPremium}
              />
            </div>
          )}
        </fieldset>

        {/* <div>
          <label className="block mb-1">Creator ID</label>
          <Input
            name="creator_id"
            placeholder="Creator ID"
            type="text"
            value={creatorId}
            onChange={(e) => setCreatorId(e.target.value)}
          />
        </div> */}

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

export default CreateDigitalProductForm