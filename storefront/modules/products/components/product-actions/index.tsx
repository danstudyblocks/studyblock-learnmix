"use client"

import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"

import MobileActions from "./mobile-actions"
import ProductPrice from "../product-price"
import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { VariantWithDigitalProduct } from "@/types/global"
import { getDigitalProductPreview } from "@/lib/data/products"
import { useRouter } from "next/navigation"
import { fetchs3json } from "@/lib/data/vendor"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (variantOptions: any) => {
  return variantOptions?.reduce((acc: Record<string, string | undefined>, varopt: any) => {
    if (varopt.option && varopt.value !== null && varopt.value !== undefined) {
      acc[varopt.option.title] = varopt.value
    }
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options);
      setOptions(variantOptions ?? {});
    }

  }, [product.variants]);


  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return;
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
  }, [product.variants, options]) as VariantWithDigitalProduct;

  // Find template data - check product level first, then variants (backward compatibility)
  const templateDigitalProduct = useMemo(() => {
    // @ts-ignore - Check product-level digital products first (for templates)
    if (product.digital_product?.template_data !== null && product.digital_product?.template_data !== undefined) {
      return product.digital_product;
    }
    
    // Fallback to variant-level (backward compatibility)
    if (product.variants && product.variants.length > 0) {
      // @ts-ignore
      return product.variants.find((v: VariantWithDigitalProduct) => 
        v.digital_product?.template_data !== null && v.digital_product?.template_data !== undefined
      )?.digital_product;
    }
    
    return null;
  }, [product]);

  // update the options when a variant is selected
  const setOptionValue = (title: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [title]: value,
    }))
  }

  const handleDownloadPreview = async () => {
    if (!templateDigitalProduct) {
      return
    }

    const downloadUrl = await getDigitalProductPreview({
      id: templateDigitalProduct.id,
    })

    if (downloadUrl.length) {
      window.open(downloadUrl)
    }
  }

  const handleLoadIntoDesignStudio = async () => {
    try {
      // @ts-ignore
      const templateData = templateDigitalProduct?.template_data;
  
      if (!templateData) {
        console.error("No template data available");
        return;
      }
  
      // Check if the templateData is a URL (it should be a string and a valid URL)
      if (typeof templateData === "string" && isValidUrl(templateData)) {
        // Fetch the JSON from the URL
        const response = await fetchs3json(templateData)
        if (!response.success) {
          console.error("Failed to fetch template data from URL:", templateData);
          return;
        }
  
        // Get the JSON content
        const fetchedData = response.data
        // Store the fetched data in localStorage
        localStorage.setItem("polotno-template", JSON.stringify(fetchedData));
      } else {
        // If templateData is already a JSON object, store it directly
        localStorage.setItem(
          "polotno-template",
          typeof templateData === "string" ? templateData : JSON.stringify(templateData)
        );
      }
  
      // Navigate to the design studio
      router.push("/design-studio");
    } catch (error) {
      console.error("Error handling template:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };
  
  // Helper function to validate if a string is a valid URL
  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  };
  

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        {/* Template button - shown above variants if template exists */}
        {templateDigitalProduct && (
          <div className="flex flex-col space-y-3 mb-4">
            {//@ts-ignore
              templateDigitalProduct.template_data === null ? (
                <Button
                  onClick={handleDownloadPreview}
                  variant="secondary"
                  className="w-full h-12 bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Preview
                </Button>
              ) : (
                <Button
                  onClick={handleLoadIntoDesignStudio}
                  variant="primary"
                  className="w-full h-12 bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium rounded-lg flex items-center justify-center transition-colors relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Load Template into Design Studio
                  {/* Show pro/free badge */}
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                    // @ts-ignore
                    templateDigitalProduct.is_premium 
                      ? 'bg-yellow-400 text-yellow-900' 
                      : 'bg-green-400 text-green-900'
                  }`}>
                    {// @ts-ignore
                      templateDigitalProduct.is_premium ? 'PRO' : 'FREE'}
                  </span>
                </Button>
              )}
          </div>
        )}

        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.title ?? ""]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />



        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant || !!disabled || isAdding}
          variant="primary"
          className="relative block w-full overflow-hidden rounded-full bg-n700 px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          <span className="relative z-10">
            {!selectedVariant
              ? "Select variant"
              : !inStock
                ? "Out of stock"
                : "Add to cart"}
          </span>
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
