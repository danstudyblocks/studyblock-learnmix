import { Text, Section, Hr } from '@react-email/components'
import * as React from 'react'
import { Base } from './base'
import { OrderDTO, OrderAddressDTO } from '@medusajs/types/dist/order/common'

export const DIGITAL_ORDER_PLACED = 'digital-order-placed'

interface DigitalOrderPlacedPreviewProps {
    order: OrderDTO & { display_id: string; summary: { raw_current_order_total: { value: number } } }
    shippingAddress: OrderAddressDTO
    notificationData: { name: string; medias: string[] }[]
}

export interface DigitalOrderPlacedTemplateProps extends DigitalOrderPlacedPreviewProps {
    preview?: string
}

export const isDigitalOrderPlacedTemplateData = (data: any): data is DigitalOrderPlacedTemplateProps =>
    typeof data.order === 'object' && typeof data.shippingAddress === 'object'

export const DigitalOrderPlacedTemplate: React.FC<DigitalOrderPlacedTemplateProps> & {
    PreviewProps: DigitalOrderPlacedPreviewProps
} = ({ order, shippingAddress, notificationData, preview = 'Your order has been placed!' }) => {
    return (
        <Base preview={preview}>
            <Section>
                <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 30px' }}>
                    Digital Order Confirmation
                </Text>

                <Text style={{ margin: '0 0 15px' }}>
                    Dear {shippingAddress.first_name} {shippingAddress.last_name},
                </Text>

                <Text style={{ margin: '0 0 30px' }}>
                    Thank you for your recent order! Here are your order details:
                </Text>

                <Text style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' }}>
                    Order Summary
                </Text>
                <Text style={{ margin: '0 0 5px' }}>
                    Order ID: {order.display_id}
                </Text>
                <Text style={{ margin: '0 0 5px' }}>
                    Order Date: {new Date(order.created_at).toLocaleDateString()}
                </Text>
                <Text style={{ margin: '0 0 20px' }}>
                    Total: {order.summary.raw_current_order_total.value} {order.currency_code}
                </Text>

                <Hr style={{ margin: '20px 0' }} />

                <Text style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 15px' }}>
                    Your Digital Downloads
                </Text>
                {notificationData.map((item, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text>
                            <a href={item.medias[0]} target="_blank" rel="noopener noreferrer">
                                Preview
                            </a>
                        </Text>
                        <Text>
                            <a href={item.medias[1]} target="_blank" rel="noopener noreferrer">
                                Download
                            </a>
                        </Text>
                    </div>
                ))}
            </Section>
        </Base>
    )
}

DigitalOrderPlacedTemplate.PreviewProps = {
    order: {
        id: 'test-order-id',
        display_id: 'ORD-123',
        created_at: new Date().toISOString(),
        email: 'test@example.com',
        currency_code: 'USD',
        items: [],
        shipping_address: {
            first_name: 'Test',
            last_name: 'User',
            address_1: '123 Main St',
            city: 'Anytown',
            province: 'CA',
            postal_code: '12345',
            country_code: 'US'
        },
        summary: { raw_current_order_total: { value: 45 } }
    },
    shippingAddress: {
        first_name: 'Test',
        last_name: 'User',
        address_1: '123 Main St',
        city: 'Anytown',
        province: 'CA',
        postal_code: '12345',
        country_code: 'US'
    },
    notificationData: [
        {
            name: 'Digital product',
            medias: [
                'http://localhost:9000/static/private-1741108084698-Medusajs-Projects.pdf',
                'http://localhost:9000/static/private-1741108084698-Medusajs-Projects.pdf'
            ]
        }
    ]
} as DigitalOrderPlacedPreviewProps

export default DigitalOrderPlacedTemplate
