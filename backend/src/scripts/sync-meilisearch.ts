import { loadEnv } from '@medusajs/utils'
import { createMedusaContainer } from '@medusajs/framework/utils'
import { Modules } from '@medusajs/framework/utils'
import { IProductModuleService } from '@medusajs/framework/types'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

async function syncProductsToMeiliSearch() {
    console.log('🚀 Starting MeiliSearch sync...')

    try {
        // Initialize Medusa container
        const container = createMedusaContainer()
        await container.resolve(Modules.PRODUCT, {})

        const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT)

        // Get products with relations using query
        const query = container.resolve('query')
        const { data: products } = await query.graph({
            entity: "product",
            fields: [
                "*",
                "variants.*",
                "images.*",
                "categories.*",
                "tags.*",
                "variants.options.*",
                "variants.prices.*"
            ]
        })

        console.log(`📦 Found ${products.length} products in database`)

        if (products.length === 0) {
            console.log('❌ No products found in database. Please create some products first.')
            return
        }

        // Transform products for MeiliSearch
        const meiliProducts = products.map(product => {
            const variant = product.variants?.[0]

            return {
                id: product.id,
                title: product.title,
                description: product.description || "",
                handle: product.handle,
                variant_sku: variant?.sku || "",
                thumbnail: product.thumbnail || product.images?.[0]?.url || "",
                status: product.status,
                created_at: product.created_at,
                updated_at: product.updated_at,
                categories: product.categories?.map(cat => cat.name) || [],
                tags: product.tags?.map(tag => tag.value) || [],
                variant_id: variant?.id || "",
                variant_title: variant?.title || "",
                price: variant?.prices?.[0]?.amount || 0,
                currency_code: variant?.prices?.[0]?.currency_code || "usd"
            }
        })

        console.log('📝 Sample product data:', JSON.stringify(meiliProducts[0], null, 2))

        // MeiliSearch configuration
        const meiliSearchHost = process.env.MEILISEARCH_HOST
        const meiliSearchKey = process.env.MEILISEARCH_ADMIN_KEY

        if (!meiliSearchHost || !meiliSearchKey) {
            console.error('❌ MeiliSearch configuration missing!')
            console.error('Please set MEILISEARCH_HOST and MEILISEARCH_ADMIN_KEY in your .env file')
            return
        }

        console.log(`🔗 Connecting to MeiliSearch at: ${meiliSearchHost}`)

        // Check if index exists, create if not
        const indexResponse = await fetch(`${meiliSearchHost}/indexes/products`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${meiliSearchKey}`,
                'Content-Type': 'application/json'
            }
        })

        if (indexResponse.status === 404) {
            console.log('📋 Creating products index...')
            const createIndexResponse = await fetch(`${meiliSearchHost}/indexes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${meiliSearchKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid: 'products',
                    primaryKey: 'id'
                })
            })

            if (!createIndexResponse.ok) {
                const error = await createIndexResponse.text()
                throw new Error(`Failed to create index: ${error}`)
            }

            console.log('✅ Products index created')
        } else if (!indexResponse.ok) {
            const error = await indexResponse.text()
            throw new Error(`Failed to check index: ${error}`)
        } else {
            console.log('✅ Products index exists')
        }

        // Configure index settings
        console.log('⚙️ Configuring index settings...')
        const settingsResponse = await fetch(`${meiliSearchHost}/indexes/products/settings`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${meiliSearchKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchableAttributes: ['title', 'description', 'variant_sku', 'categories', 'tags'],
                displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail', 'status', 'price', 'currency_code'],
                filterableAttributes: ['id', 'handle', 'status', 'categories', 'tags'],
                sortableAttributes: ['created_at', 'updated_at', 'price']
            })
        })

        if (!settingsResponse.ok) {
            const error = await settingsResponse.text()
            console.warn(`⚠️ Failed to update index settings: ${error}`)
        } else {
            console.log('✅ Index settings configured')
        }

        // Add documents to MeiliSearch
        console.log('📤 Uploading products to MeiliSearch...')
        const response = await fetch(`${meiliSearchHost}/indexes/products/documents`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${meiliSearchKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meiliProducts)
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Failed to upload products: ${error}`)
        }

        const result = await response.json()
        console.log(`✅ Successfully uploaded ${meiliProducts.length} products to MeiliSearch`)
        console.log(`📋 Task UID: ${result.taskUid}`)

        // Wait for indexing to complete
        console.log('⏳ Waiting for indexing to complete...')
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Test search
        console.log('🔍 Testing search...')
        const searchResponse = await fetch(`${meiliSearchHost}/indexes/products/search`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${meiliSearchKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: '',
                limit: 5
            })
        })

        if (searchResponse.ok) {
            const searchResult = await searchResponse.json()
            console.log(`✅ Search test successful! Found ${searchResult.estimatedTotalHits} products`)
            console.log('📋 Sample results:', searchResult.hits.slice(0, 2))
        } else {
            console.warn('⚠️ Search test failed')
        }

    } catch (error) {
        console.error('❌ Error syncing products to MeiliSearch:', error)
        process.exit(1)
    }
}

// Run the sync
syncProductsToMeiliSearch()
    .then(() => {
        console.log('🎉 MeiliSearch sync completed!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('💥 Sync failed:', error)
        process.exit(1)
    })
