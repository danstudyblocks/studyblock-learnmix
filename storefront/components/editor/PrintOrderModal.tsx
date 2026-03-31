"use client"

import { useState, useEffect } from "react"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

// ---------------------------------------------------------------------------
// Product catalogue
// ---------------------------------------------------------------------------
type PrintProduct = {
  id: string
  category: "poster" | "postcard"
  label: string
  description: string
  priceGbp: number
  unit: string
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
    priceGbp: 6.0,
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
    priceGbp: 25.0,
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
  const dataUrl: string = await store.toPDFDataURL({ pixelRatio: 3, includeBleed: false })
  return dataUrl.split(",")[1] ?? dataUrl
}

async function createPrintCart(payload: {
  product_id: string
  quantity: number
  unit_price_gbp: number
  total_price_gbp: number
  pdf_base64: string
  design_snapshot: unknown
  customer_id: string
}): Promise<{ cart_id: string; pdf_url?: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"}/store/print-orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
      },
      credentials: "include",
      body: JSON.stringify({
        title: `${payload.product_id} × ${payload.quantity}`,
        design_snapshot: payload.design_snapshot,
        customer_id: payload.customer_id,
        metadata: {
          product_id: payload.product_id,
          product_type: payload.product_id.replace("poster-", "").replace("postcards", "postcard"),
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
const STEP_LABELS = ["Choose product", "Delivery", "Payment", "Confirmation"] as const

const Steps = ({ step }: { step: 1 | 2 | 3 | 4 }) => (
  <div className="flex items-center gap-2 px-6 pb-5">
    {STEP_LABELS.map((label, i) => {
      const n = (i + 1) as 1 | 2 | 3 | 4
      const active = n === step
      const done = n < step
      return (
        <div key={label} className="flex items-center gap-1.5 min-w-0">
          {i > 0 && <div className={`h-px w-4 flex-shrink-0 ${done ? "bg-[#7b5cff]" : "bg-[#e8e2d8]"}`} />}
          <div className="flex items-center gap-1 min-w-0">
            <div
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold
              ${done ? "bg-[#7b5cff] text-white" : active ? "border-2 border-[#7b5cff] text-[#7b5cff]" : "border border-[#d4ccbf] text-[#a39b8e]"}`}
            >
              {done ? "✓" : n}
            </div>
            <span className={`text-[10px] font-medium truncate ${active ? "text-[#171717]" : "text-[#a39b8e]"}`}>
              {label}
            </span>
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
      ${selected ? "border-[#7b5cff] bg-[#f5f2ff] shadow-[0_0_0_2px_rgba(123,92,255,0.15)]" : "border-[#d8d2c8] bg-white hover:border-[#a39b8e]"}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${selected ? "border-[#7b5cff]" : "border-[#d4ccbf]"}`}>
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
// Stripe card form (inner — must be inside <Elements>)
// ---------------------------------------------------------------------------
const CARD_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      color: "#171717",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "::placeholder": { color: "#b0a89e" },
    },
    invalid: { color: "#dc2626" },
  },
}

type StripeFormProps = {
  clientSecret: string
  cartId: string
  pdfUrl: string | null
  total: number
  customerEmail: string
  onSuccess: (orderId: string | null) => void
  onError: (msg: string) => void
}

const StripeCardForm = ({ clientSecret, cartId, pdfUrl, total, customerEmail, onSuccess, onError }: StripeFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)
  const [cardReady, setCardReady] = useState(false)

  const handlePay = async () => {
    if (!stripe || !elements) return
    const card = elements.getElement(CardElement)
    if (!card) return

    setPaying(true)
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { email: customerEmail },
        },
      })

      if (error) {
        if (
          error.payment_intent?.status === "requires_capture" ||
          error.payment_intent?.status === "succeeded"
        ) {
          // Payment went through despite error object
        } else {
          onError(error.message ?? "Payment failed")
          return
        }
      }

      if (
        paymentIntent?.status === "succeeded" ||
        paymentIntent?.status === "requires_capture" ||
        error?.payment_intent?.status === "succeeded" ||
        error?.payment_intent?.status === "requires_capture"
      ) {
        // Complete the Medusa order
        const completeRes = await fetch("/api/print-orders/complete-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart_id: cartId, pdf_url: pdfUrl }),
        })
        const completeData = await completeRes.json()
        if (!completeRes.ok) throw new Error(completeData.error ?? "Failed to place order")
        onSuccess(completeData.order_id ?? null)
      } else {
        onError("Payment was not completed. Please try again.")
      }
    } catch (err: any) {
      onError(err.message ?? "An unexpected error occurred")
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#d8d2c8] bg-white px-4 py-3.5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#a39b8e]">Card details</p>
        <CardElement
          options={CARD_STYLE}
          onChange={(e) => setCardReady(e.complete)}
          className="py-1"
        />
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || !cardReady || paying}
        className="w-full rounded-xl bg-[#7b5cff] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6548e0] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {paying ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Processing…
          </>
        ) : (
          `Pay ${fmt(total)}`
        )}
      </button>

      <p className="text-center text-[10px] text-[#a39b8e]">
        🔒 Secured by Stripe — your card details are never stored on our servers
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------
type Step = 1 | 2 | 3 | 4

type DeliveryFields = {
  first_name: string
  last_name: string
  address_1: string
  city: string
  postal_code: string
  country_code: string
  phone: string
}

const SHIPPING = { label: "FedEx", price: 4.95, description: "3–5 working days · Royal Mail tracked" }

// ---------------------------------------------------------------------------
// Order summary card (shared across steps)
// ---------------------------------------------------------------------------
const OrderSummary = ({
  product,
  qty,
  compact = false,
  address,
}: {
  product: PrintProduct
  qty: number
  compact?: boolean
  address?: { first_name: string; last_name: string; address_1: string; city: string; postal_code: string }
}) => {
  const subtotal = product.priceGbp * (qty / product.quantityStep)
  const grandTotal = subtotal + SHIPPING.price
  return (
    <div className="rounded-2xl border border-[#d8d2c8] bg-white divide-y divide-[#e8e2d8] mb-5">
      {/* Item row */}
      <div className="flex items-start justify-between gap-4 px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold text-[#171717]">{product.label}</p>
          <p className="text-xs text-[#7f7668]">{product.description}</p>
          {!compact && (
            <p className="mt-0.5 text-xs text-[#a39b8e]">
              {fmt(product.priceGbp)} {product.unit} × {qty}
            </p>
          )}
        </div>
        <p className="text-sm font-semibold text-[#171717] flex-shrink-0">{fmt(subtotal)}</p>
      </div>
      {/* Shipping row */}
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#5d5549]">🚚</span>
          <div>
            <p className="text-xs font-medium text-[#5d5549]">{SHIPPING.label}</p>
            <p className="text-[10px] text-[#a39b8e]">{SHIPPING.description}</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-[#171717] flex-shrink-0">{fmt(SHIPPING.price)}</p>
      </div>
      {/* Address row (optional) */}
      {address && (
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#a39b8e] mb-0.5">Delivering to</p>
          <p className="text-xs text-[#5d5549]">
            {address.first_name} {address.last_name}, {address.address_1}, {address.city}, {address.postal_code.toUpperCase()}
          </p>
        </div>
      )}
      {/* Total row */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-[#f7f4f1] rounded-b-2xl">
        <p className="text-sm font-semibold text-[#171717]">Total</p>
        <p className="text-base font-bold text-[#7b5cff]">{fmt(grandTotal)}</p>
      </div>
    </div>
  )
}

const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY ?? ""
// Test mode: no real Stripe key configured
const IS_TEST_MODE =
  !STRIPE_KEY ||
  STRIPE_KEY === "pk_test_placeholder" ||
  STRIPE_KEY.startsWith("pk_test_placeholder")

let stripePromise: ReturnType<typeof loadStripe> | null = null
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = STRIPE_KEY && !IS_TEST_MODE ? loadStripe(STRIPE_KEY) : Promise.resolve(null)
  }
  return stripePromise
}

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
    postcards: 100,
  })
  const [delivery, setDelivery] = useState<DeliveryFields>({
    first_name: customer?.first_name ?? "",
    last_name: customer?.last_name ?? "",
    address_1: "",
    city: "",
    postal_code: "",
    country_code: "gb",
    phone: "",
  })
  const [preparing, setPreparing] = useState(false)
  const [testPlacing, setTestPlacing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [stripeObj, setStripeObj] = useState<Stripe | null>(null)

  useEffect(() => {
    getStripe().then((s) => setStripeObj(s as Stripe | null))
  }, [])

  const product = PRODUCTS.find((p) => p.id === selectedId)!
  const qty = quantities[selectedId]
  const subtotal = product.priceGbp * (qty / product.quantityStep)
  const total = subtotal + SHIPPING.price

  const setQty = (id: string, q: number) =>
    setQuantities((prev) => ({ ...prev, [id]: q }))

  const deliveryValid =
    delivery.first_name.trim() &&
    delivery.last_name.trim() &&
    delivery.address_1.trim() &&
    delivery.city.trim() &&
    delivery.postal_code.trim()

  const handleProceedToPayment = async () => {
    if (!customer?.id) { setError("Please sign in to place a print order."); return }
    if (!deliveryValid) { setError("Please fill in all delivery fields."); return }
    setPreparing(true)
    setError(null)
    try {
      const [pdfBase64, designSnapshot] = await Promise.all([
        generatePdfBase64(store),
        Promise.resolve(store.toJSON()),
      ])

      // 1. Create the cart with the print item
      const cartData = await createPrintCart({
        product_id: product.id,
        quantity: qty,
        unit_price_gbp: product.priceGbp,
        total_price_gbp: subtotal,
        pdf_base64: pdfBase64,
        design_snapshot: designSnapshot,
        customer_id: customer.id,
      })
      const newCartId = cartData.cart_id
      setCartId(newCartId)
      setPdfUrl(cartData.pdf_url ?? null)

      if (!IS_TEST_MODE) {
        // 2. Set delivery address & initiate Stripe payment session
        const payRes = await fetch("/api/print-orders/initiate-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: newCartId,
            email: customer.email,
            ...delivery,
          }),
        })
        const payData = await payRes.json()
        if (!payRes.ok) throw new Error(payData.error ?? "Could not initiate payment")
        setClientSecret(payData.client_secret)
      }

      setStep(3)
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.")
    } finally {
      setPreparing(false)
    }
  }

  // Test mode: bypass Stripe and complete the cart directly
  const handleTestOrder = async () => {
    if (!cartId) return
    setTestPlacing(true)
    setError(null)
    try {
      const res = await fetch("/api/print-orders/complete-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cartId,
          email: customer?.email,
          address: delivery,
          pdf_url: pdfUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to place order")
      setOrderId(data.order_id ?? null)
      setStep(4)
    } catch (err: any) {
      setError(err.message ?? "Something went wrong")
    } finally {
      setTestPlacing(false)
    }
  }

  const inputClass =
    "w-full px-3 py-2 text-sm bg-white border border-[#d8d2c8] rounded-lg text-[#171717] placeholder-[#b0a89e] focus:outline-none focus:border-[#7b5cff] transition-colors"
  const labelClass = "block text-[10px] font-semibold uppercase tracking-wider text-[#7f7668] mb-1"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#fcfaf8] shadow-[0_24px_80px_rgba(0,0,0,0.18)] overflow-hidden max-h-[90vh] flex flex-col"
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
        <div className="border-b border-[#d8d2c8] px-6 py-5 flex-shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f7668]">Professional printing</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#171717]">Buy a Print</h2>
        </div>

        <div className="px-6 pt-4 flex-shrink-0">
          <Steps step={step} />
        </div>

        <div className="overflow-y-auto flex-1 px-6 pb-6">

          {/* ── Step 1: Choose product ── */}
          {step === 1 && (
            <div>
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
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 2: Delivery details ── */}
          {step === 2 && (
            <div>
              <OrderSummary product={product} qty={qty} />

              {/* Delivery address */}
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7f7668]">Delivery address</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>First name</label>
                    <input
                      className={inputClass}
                      placeholder="Jane"
                      value={delivery.first_name}
                      onChange={(e) => setDelivery((p) => ({ ...p, first_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last name</label>
                    <input
                      className={inputClass}
                      placeholder="Smith"
                      value={delivery.last_name}
                      onChange={(e) => setDelivery((p) => ({ ...p, last_name: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Address line 1</label>
                  <input
                    className={inputClass}
                    placeholder="12 Example Street"
                    value={delivery.address_1}
                    onChange={(e) => setDelivery((p) => ({ ...p, address_1: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      className={inputClass}
                      placeholder="London"
                      value={delivery.city}
                      onChange={(e) => setDelivery((p) => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Postcode</label>
                    <input
                      className={inputClass}
                      placeholder="SW1A 1AA"
                      value={delivery.postal_code}
                      onChange={(e) => setDelivery((p) => ({ ...p, postal_code: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Phone (optional)</label>
                  <input
                    className={inputClass}
                    placeholder="+44 7700 900000"
                    value={delivery.phone}
                    onChange={(e) => setDelivery((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#d8d2c8] bg-white px-4 py-3 mb-5">
                <p className="text-xs text-[#5d5549] leading-5">
                  📄 A high-resolution PDF of your current design will be sent to our print team.
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
                  onClick={() => { setStep(1); setError(null) }}
                  className="flex-1 rounded-xl border border-[#d4ccbf] bg-white px-4 py-3 text-sm font-semibold text-[#3d352c] transition hover:border-[#171717]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={preparing || !deliveryValid}
                  className="flex-1 rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2620] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {preparing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Preparing…
                    </>
                  ) : (
                    "Continue to payment →"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Payment ── */}
          {step === 3 && (
            <div>
              <OrderSummary product={product} qty={qty} compact address={delivery} />

              {IS_TEST_MODE ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                    <p className="text-xs font-semibold text-amber-800 mb-1">🧪 Test mode — Stripe not configured</p>
                    <p className="text-xs text-amber-700 leading-5">
                      No live Stripe key detected. Click below to place a test order and verify the full order flow without a real payment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestOrder}
                    disabled={testPlacing}
                    className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {testPlacing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Placing test order…
                      </>
                    ) : (
                      `Place test order · ${fmt(total)}`
                    )}
                  </button>
                </div>
              ) : clientSecret && stripeObj ? (
                <Elements stripe={stripeObj} options={{ clientSecret }}>
                  <StripeCardForm
                    clientSecret={clientSecret}
                    cartId={cartId!}
                    pdfUrl={pdfUrl}
                    total={total}
                    customerEmail={customer?.email ?? ""}
                    onSuccess={(id) => { setOrderId(id); setStep(4) }}
                    onError={(msg) => setError(msg)}
                  />
                </Elements>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#d4ccbf] border-t-[#7b5cff]" />
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={() => { setStep(2); setError(null) }}
                className="mt-3 w-full rounded-xl border border-[#d4ccbf] bg-white px-4 py-2.5 text-sm font-medium text-[#3d352c] transition hover:border-[#171717]"
              >
                ← Back
              </button>
            </div>
          )}

          {/* ── Step 4: Confirmation ── */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdf4] border border-green-200">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#171717] mb-2">Order placed!</h3>
              <p className="text-sm text-[#5d5549] leading-6 mb-4">
                We'll email <strong>{customer?.email ?? "you"}</strong> with dispatch details.
              </p>
              <OrderSummary product={product} qty={qty} compact address={delivery} />
              {orderId && (
                <p className="mb-6 text-xs text-[#a39b8e]">Order ref: {orderId}</p>
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
    </div>
  )
}
