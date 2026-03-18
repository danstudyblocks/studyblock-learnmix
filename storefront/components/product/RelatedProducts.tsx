//@ts-nocheck
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ShopCard from "../ui/ShopCard"


type RelatedProductsProps = {
    product: HttpTypes.StoreProduct
    countryCode: string
}

type StoreProductParamsWithTags = HttpTypes.StoreProductParams & {
    tags?: string[]
}

type StoreProductWithTags = HttpTypes.StoreProduct & {
    tags?: { value: string }[]
}

export default async function RelatedProducts({
    product,
    countryCode,
}: RelatedProductsProps) {
    const region = await getRegion(countryCode)

    if (!region) {
        const queryParams: StoreProductParamsWithTags = {}
    }

    // edit this function to define your related products logic
    const queryParams: StoreProductParamsWithTags = {}
    if (region?.id) {
        queryParams.region_id = region.id
    }
    if (product.collection_id) {
        queryParams.collection_id = [product.collection_id]
    }
    const productWithTags = product as StoreProductWithTags
    if (productWithTags.tags) {
        queryParams.tags = productWithTags.tags
            .map((t) => t.value)
            .filter(Boolean) as string[]
    }
    queryParams.is_giftcard = false

    const products = await getProductsList({
        queryParams,
        countryCode,
    }).then(({ response }) => {
        return response.products.filter(
            (responseProduct) => responseProduct.id !== product.id
        )
    })

    if (!products.length) {
        return null
    }

    return (
        <>
            <h3 className="heading-3 w-full">Related products</h3>
            <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8 lg:mt-4">
                {products?.slice(0, 4).map(({ id, ...product }, idx) => (
                    <div key={id}>
                        <ShopCard {...product} id={id} region={region} />
                    </div>
                ))}
            </ul>
        </>
    )
}
