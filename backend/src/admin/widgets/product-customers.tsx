import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
import { Container, Heading, Table, Button } from "@medusajs/ui"

const ProductCustomersWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const [customer, setCustomer] = useState<{
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    company_name: string | null
    phone?: string | null
    addresses: { id: string; address: string }[] // Assuming address is a simple string or object
    metadata?: Record<string, unknown>
    created_at?: string
    updated_at?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      return
    }

    // Fetch the customer linked to the product (custom API route)
    fetch(`/admin/products/${data.id}/customer`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ customer }) => {
        setCustomer(customer)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching customer:", error)
        setLoading(false)
      })
  }, [loading, data.id])

  return (
    <Container className="divide-y p-0">
      {loading && <span>Loading...</span>}
      {customer ? (
        <>
          <div className="flex items-center justify-between px-6 py-4">
            <Heading level="h2">Linked Studyblock Creator</Heading>
          </div>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell><strong>Name</strong></Table.Cell>
                <Table.Cell>{customer.first_name} {customer.last_name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Email</strong></Table.Cell>
                <Table.Cell>{customer.email}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Phone</strong></Table.Cell>
                <Table.Cell>{customer.phone || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Company</strong></Table.Cell>
                <Table.Cell>{customer.company_name || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Created At</strong></Table.Cell>
                <Table.Cell>{new Date(customer.created_at).toLocaleString()}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><strong>Updated At</strong></Table.Cell>
                <Table.Cell>{new Date(customer.updated_at).toLocaleString()}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between px-6 py-4">
            <Heading level="h3">No Studyblock Creator linked to this product.</Heading>
          </div>
        </>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before", // Add this widget before the product details
})

export default ProductCustomersWidget
