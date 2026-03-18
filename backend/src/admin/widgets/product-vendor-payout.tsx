import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
import { Container, Heading, Table, Button } from "@medusajs/ui"

const OrderVendorPayoutWidget = ({
  data,
}: DetailWidgetProps<AdminOrder>) => {
  const [paymentDetails, setPaymentDetails] = useState<{
    id: string
    creator_id: string
    account_holder_name: string
    bank_name: string
    account_number: string
    swift_code: string
    amount_due: number
    status: string
    requested_at: string
    processed_at: string | null
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      return
    }

    // Fetch the payment details linked to the order (custom API route)
    fetch(`/admin/orders/${data.id}/vendor-payout`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ payout }) => {
        console.log(JSON.stringify("paymentDetails1",payout))
        setPaymentDetails(payout)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error)
        setLoading(false)
      })
  }, [loading, data.id])

  return (
    <Container className="divide-y p-0">
      {loading && <span>Loading...</span>}
      {paymentDetails ? (
        <>
          <div className="flex items-center justify-between px-6 py-4">
            <Heading level="h2">Linked Vendor Payment Details</Heading>
          </div>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell><strong>Account Holder</strong></Table.Cell>
                <Table.Cell>{paymentDetails.account_holder_name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Bank Name</strong></Table.Cell>
                <Table.Cell>{paymentDetails.bank_name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Account Number</strong></Table.Cell>
                <Table.Cell>{paymentDetails.account_number}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>SWIFT Code</strong></Table.Cell>
                <Table.Cell>{paymentDetails.swift_code}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Amount Due</strong></Table.Cell>
                <Table.Cell>${paymentDetails.amount_due}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Status</strong></Table.Cell>
                <Table.Cell>{paymentDetails.status}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Requested At</strong></Table.Cell>
                <Table.Cell>{new Date(paymentDetails.requested_at).toLocaleString()}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Processed At</strong></Table.Cell>
                <Table.Cell>{paymentDetails.processed_at ? new Date(paymentDetails.processed_at).toLocaleString() : "N/A"}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <div className="px-6 py-4">
            <Button onClick={() => alert("Processing payout...")}>Process Payout</Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between px-6 py-4">
            <Heading level="h3">No payment details linked to this order.</Heading>
          </div>
        </>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.before", // Add this widget at the end of the order details
})

export default OrderVendorPayoutWidget
