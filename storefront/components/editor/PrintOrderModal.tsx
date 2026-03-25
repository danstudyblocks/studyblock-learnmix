"use client"

import { useState } from "react"

// ---------------------------------------------------------------------------
// Product catalogue
// ---------------------------------------------------------------------------
type PrintProduct = {
  id: string
  category: "poster" | "postcard"
  label: string
  description: string
  priceGbp: number
  unit: string // e.g. "per print" or "per 100"
  quantityStep: number
  minQuantity: number
}

const PRODUCTS: PrintProduct[] = [
  {
    id: "poster-a1",
    category: "poster",
    label: "A1 Poster",
    description: "594 × 841 mm — ideal for classroom display",
    priceGbp: 8.95,
    unit: "per print",
    quantityStep: 1,
    minQuantity: 1,
  },
  {
    id: "poster-a2",
    category: "poster",
    label: "A2 Poster",
    description: "420 × 594 mm — great for wall charts",
    priceGbp: 6.00,
    unit: "per print",
    quantityStep: 1,
    minQuantity: 1,
  },
  {
    id: "poster-a3",
    category: "poster",
    label: "A3 Poster",
    description: "297 × 420 mm — perfect for desk reference",
    priceGbp: 3.95,
    unit: "per print",
    quantityStep: 1,
    minQuantity: 1,
  },
  {
    id: "postcards",
    category: "postcard",
    label: "Postcards",
    description: "A6 (148 × 105 mm) — printed in packs of 100",
    priceGbp: 25.00,
    unit: "per 100",
    quantityStep: 100,
    minQuantity: 100,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const fmt = (p: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(p)

async function generatePdfBase64(store: any): Promise<string> {
  await store.waitLoading?.({ _skipTimeout: true }).catch(() => {})
  const dataUrl: string = await store.toPDFDataURL({
    pixelRatio: 3,
    includeBleed: false,
  })
  // dataUrl is "data:application/pdf;base64,<b64>"
  return dataUrl.split(",")[1] ?? dataUrl
}

async function submitPrintOrder(payload: {
  product_id: string
  quantity: number
  unit_price_gbp: number
  total_price_gbp: number
  pdf_base64: string
  design_snapshot: unknown
  customer_id: string
}) {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"}/store/print-orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
      },
      credentials: "include",
      body: JSON.stringify({
        title: `${payload.product_id} × ${payload.quantity}`,
        design_snapshot: payload.design_snapshot,
        customer_id: payload.customer_id,
        metadata: {
          product_id: payload.product_id,
          quantity: payload.quantity,
          unit_price_gbp: payload.unit_price_gbp,
          total_price_gbp: payload.total_price_gbp,
          pdf_base64: payload.pdf_base64,
        },
      }),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? `Server error ${res.status}`)
  }
  return res.json()
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------
const Steps = ({ step }: { step: 1 | 2 | 3 }) => (
  <div className="flex items-center gap-2 px-6 pb-5">
    {(["Choose product", "Review order", "Confirmation"] as const).map((label, i) => {
      const n = i + 1
      const active = n === step
      const done = n < step
      return (
        <div key={label} className="flex items-center gap-2">
          {i > 0 && <div className={`h-px w-5 flex-shrink-0 ${done ? "bg-[#7b5cff]" : "bg-[#e8e2d8]"}`} />}
          <div className="flex items-center gap-1.5">
            <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold
              ${done ? "bg-[#7b5cff] text-white" : active ? "border-2 border-[#7b5cff] text-[#7b5cff]" : "border border-[#d4ccbf] text-[#a39b8e]"}`}>
              {done ? "✓" : n}
            </div>
            <span className={`text-xs font-medium ${active ? "text-[#171717]" : "text-[#a39b8e]"}`}>{label}</span>
          </div>
        </div>
      )
    })}
  </div>
)

// ---------------------------------------------------------------------------
// Product card
// ---------------------------------------------------------------------------
const ProductCard = ({
  product, selected, quantity, onSelect, onQuantityChange,
}: {
  product: PrintProduct
  selected: boolean
  quantity: number
  onSelect: () => void
  onQuantityChange: (q: number) => void
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full rounded-2xl border p-4 text-left transition
      ${selected
        ? "border-[#7b5cff] bg-[#f5f2ff] shadow-[0_0_0_2px_rgba(123,92,255,0.15)]"
        : "border-[#d8d2c8] bg-white hover:border-[#a39b8e]"
      }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {/* Radio dot */}
        <div className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition
          ${selected ? "border-[#7b5cff]" : "border-[#d4ccbf]"}`}>
          {selected && <div className="h-2 w-2 rounded-full bg-[#7b5cff]" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#171717]">{product.label}</p>
          <p className="mt-0.5 text-xs text-[#7f7668]">{product.description}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-[#171717]">{fmt(product.priceGbp)}</p>
        <p className="text-[10px] text-[#a39b8e]">{product.unit}</p>
      </div>
    </div>

    {/* Quantity selector — shown only when selected */}
    {selected && (
      <div className="mt-4 flex items-center gap-3 border-t border-[#e8e2d8] pt-4" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs font-medium text-[#5d5549]">Quantity</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(product.minQuantity, quantity - product.quantityStep))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#d4ccbf] bg-white text-[#5d5549] hover:border-[#171717] transition"
          >−</button>
          <span className="min-w-[3rem] text-center text-sm font-semibold text-[#171717]">{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(quantity + product.quantityStep)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#d4ccbf] bg-white text-[#5d5549] hover:border-[#171717] transition"
          >+</button>
        </div>
        <span className="ml-auto text-sm font-bold text-[#7b5cff]">
          {fmt(product.priceGbp * (quantity / product.quantityStep))}
        </span>
      </div>
    )}
  </button>
)

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------
type Step = 1 | 2 | 3

export const PrintOrderModal = ({
  store,
  customer,
  onClose,
}: {
  store: any
  customer: any
  onClose: () => void
}) => {
  const [step, setStep] = useState<Step>(1)
  const [selectedId, setSelectedId] = useState<string>("poster-a3")
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "poster-a1": 1,
    "poster-a2": 1,
    "poster-a3": 1,
    "postcards": 100,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const product = PRODUCTS.find((p) => p.id === selectedId)!
  const qty = quantities[selectedId]
  const total = product.priceGbp * (qty / product.quantityStep)

  const setQty = (id: string, q: number) =>
    setQuantities((prev) => ({ ...prev, [id]: q }))

  const handleSubmit = async () => {
    if (!customer?.id) {
      setError("Please sign in to place a print order.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const [pdfBase64, designSnapshot] = await Promise.all([
        generatePdfBase64(store),
        Promise.resolve(store.toJSON()),
      ])
      const result = await submitPrintOrder({
        product_id: product.id,
        quantity: qty,
        unit_price_gbp: product.priceGbp,
        total_price_gbp: total,
        pdf_base64: pdfBase64,
        design_snapshot: designSnapshot,
        customer_id: customer.id,
      })
      setOrderId(result?.id ?? result?.cart_id ?? "confirmed")
      setStep(3)
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#fcfaf8] shadow-[0_24px_80px_rgba(0,0,0,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#d8d2c8] text-[#7f7668] hover:text-[#171717] transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="border-b border-[#d8d2c8] px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f7668]">Professional printing</p>
          <h2 className="mt-1.5 text-2xl font-semibold text-[#171717]">Buy a Print</h2>
        </div>

        <div className="px-6 pt-5">
          <Steps step={step} />
        </div>

        {/* Step 1 — Choose product */}
        {step === 1 && (
          <div className="px-6 pb-6">
            {/* Posters */}
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7f7668]">Posters</p>
            <div className="space-y-2 mb-5">
              {PRODUCTS.filter((p) => p.category === "poster").map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  selected={selectedId === p.id}
                  quantity={quantities[p.id]}
                  onSelect={() => setSelectedId(p.id)}
                  onQuantityChange={(q) => setQty(p.id, q)}
                />
              ))}
            </div>

            {/* Postcards */}
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7f7668]">Postcards</p>
            <div className="space-y-2 mb-6">
              {PRODUCTS.filter((p) => p.category === "postcard").map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  selected={selectedId === p.id}
                  quantity={quantities[p.id]}
                  onSelect={() => setSelectedId(p.id)}
                  onQuantityChange={(q) => setQty(p.id, q)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2620]"
            >
              Continue to review →
            </button>
          </div>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div className="px-6 pb-6">
            <div className="rounded-2xl border border-[#d8d2c8] bg-white p-5 mb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#171717]">{product.label}</p>
                  <p className="mt-0.5 text-xs text-[#7f7668]">{product.description}</p>
                  <p className="mt-2 text-xs text-[#5d5549]">
                    Qty: <span className="font-semibold">{qty}</span>
                    {" · "}
                    {fmt(product.priceGbp)} {product.unit}
                  </p>
                </div>
                <p className="text-lg font-bold text-[#171717] flex-shrink-0">{fmt(total)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d8d2c8] bg-white px-5 py-4 mb-4">
              <p className="text-xs text-[#5d5549] leading-5">
                📄 A high-resolution PDF of your current design will be sent to our print team.
                Orders are typically fulfilled within <strong>3–5 working days</strong> and delivered by Royal Mail.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-[#d4ccbf] bg-white px-4 py-3 text-sm font-semibold text-[#3d352c] transition hover:border-[#171717]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-xl bg-[#7b5cff] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6548e0] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Preparing PDF…
                  </>
                ) : (
                  <>Place order · {fmt(total)}</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Confirmation */}
        {step === 3 && (
          <div className="px-6 pb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdf4] border border-green-200">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#171717] mb-2">Order placed!</h3>
            <p className="text-sm text-[#5d5549] leading-6 mb-1">
              Your <strong>{product.label}</strong> × {qty} has been submitted.
            </p>
            <p className="text-sm text-[#5d5549] leading-6 mb-6">
              We'll email you at <strong>{customer?.email ?? "your email"}</strong> with dispatch details.
            </p>
            {orderId && (
              <p className="mb-6 text-xs text-[#a39b8e]">Reference: {orderId}</p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2620]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
