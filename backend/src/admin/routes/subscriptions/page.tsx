import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ClockSolid } from "@medusajs/icons"
import { Container, Heading, Badge, createDataTableColumnHelper, useDataTable, DataTablePaginationState, DataTable } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { SubscriptionData, SubscriptionStatus } from "../../types"
import { sdk } from "../../lib/sdk"

const getBadgeColor = (status: SubscriptionStatus) => {
  switch(status) {
    case SubscriptionStatus.CANCELED:
      return "orange"
    case SubscriptionStatus.FAILED:
      return "red"
    case SubscriptionStatus.EXPIRED:
      return "grey"
    default:
      return "green"
  }
}

const getStatusTitle = (status: SubscriptionStatus) => {
  return status.charAt(0).toUpperCase() + status.substring(1)
}

const columnHelper = createDataTableColumnHelper<SubscriptionData>()

const columns = [
  columnHelper.accessor("id", {
    header: "#",
  }),
  columnHelper.accessor("metadata.main_order_id", {
    header: "Main Order",
  }),
  columnHelper.accessor("metadata.userId", {
    header: "Customer"
  }),
  columnHelper.accessor("subscription_date", {
    header: "Subscription Date",
    cell: ({ getValue }) => {
      return getValue().toLocaleString()
    }
  }),
  columnHelper.accessor("expiration_date", {
    header: "Expiry Date",
    cell: ({ getValue }) => {
      return getValue().toLocaleString()
    }
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      return (
        <Badge color={getBadgeColor(getValue())}>
          {getStatusTitle(getValue())}
        </Badge>
      )
    }
  }),
]

const SubscriptionsPage = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: 4,
    pageIndex: 0,
  })

  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const limit = pagination.pageSize
        const offset = pagination.pageIndex * pagination.pageSize
        const res = await sdk.client.fetch(`/admin/subscriptions?limit=${limit}&offset=${offset}`)
        //@ts-ignore
        setSubscriptions(res?.subscriptions || [])
        //@ts-ignore
        setCount(res?.count || 0)
      } catch (err) {
        console.error("failed to fetch subscriptions", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [pagination.pageSize, pagination.pageIndex])

  const table = useDataTable({
    columns,
    data: subscriptions,
    getRowId: (subscription) => subscription.id,
    rowCount: count,
    isLoading: loading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    }
  })

  return (
    <Container>
      <DataTable instance={table}>
        <DataTable.Toolbar>
          <Heading level="h1">Subscriptions</Heading>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Subscriptions",
  icon: ClockSolid,
})

export default SubscriptionsPage
