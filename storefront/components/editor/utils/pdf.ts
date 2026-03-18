import type { StoreType } from "polotno/model/store"

type DownloadPdfOptions = {
  fileName?: string
  pixelRatio?: number
  includeBleed?: boolean
  cropMarkSize?: number
}

const DEFAULT_FILENAME = "design.pdf"
// Very high pixelRatio for professional print-quality PDFs (5 = ~375 DPI equivalent)
// This ensures crisp, non-blurred output even when zoomed
const DEFAULT_PIXEL_RATIO = 5
const DEFAULT_BLEED = true
// No crop/trim lines on corners - clean design
const DEFAULT_CROP_MARK_SIZE = 0

export const downloadHighQualityPdf = async (
  store: StoreType,
  {
    fileName = DEFAULT_FILENAME,
    pixelRatio = DEFAULT_PIXEL_RATIO,
    includeBleed = DEFAULT_BLEED,
    cropMarkSize = DEFAULT_CROP_MARK_SIZE,
  }: DownloadPdfOptions = {}
) => {
  if (!store?.pages?.length) {
    throw new Error("No pages available to export")
  }

  await store.waitLoading({ _skipTimeout: true })

  // Use Polotno's built-in saveAsPDF method which handles bleed areas and crop marks
  // cropMarkSize is supported by Polotno but not in TypeScript definitions
  await store.saveAsPDF({
    fileName,
    includeBleed,
    cropMarkSize,
    pixelRatio,
  } as any)
}
