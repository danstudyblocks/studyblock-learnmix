import { Client } from 'pg'
import { loadEnv } from '@medusajs/utils'

export default async function createDigitalProductTables() {
  loadEnv(process.env.NODE_ENV || 'development', process.cwd())
  const DATABASE_URL = process.env.DATABASE_URL

  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  const client = new Client({
    connectionString: DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('Connected to database')

    // SQL from Migration20251119172219.ts to create all digital_product tables
    const sql = `
      -- Create digital_product table
      CREATE TABLE IF NOT EXISTS "digital_product" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "creator_id" TEXT NULL,
        "is_premium" BOOLEAN NOT NULL DEFAULT false,
        "show_in_studio" BOOLEAN NOT NULL DEFAULT false,
        "category_top" TEXT NULL,
        "category_sub" TEXT NULL,
        "tags" TEXT[] NULL,
        "thumbnail" TEXT NULL,
        "isTemplate" BOOLEAN NOT NULL DEFAULT false,
        "template_data" JSONB NULL,
        "approval_status" TEXT NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ NULL,
        CONSTRAINT "digital_product_pkey" PRIMARY KEY ("id")
      );

      -- Create index for digital_product
      CREATE INDEX IF NOT EXISTS "IDX_digital_product_deleted_at" 
        ON "digital_product" (deleted_at) 
        WHERE deleted_at IS NULL;

      -- Create digital_product_media table
      CREATE TABLE IF NOT EXISTS "digital_product_media" (
        "id" TEXT NOT NULL,
        "type" TEXT CHECK ("type" IN ('main', 'preview')) NOT NULL,
        "fileId" TEXT NOT NULL,
        "mimeType" TEXT NOT NULL,
        "digital_product_id" TEXT NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ NULL,
        CONSTRAINT "digital_product_media_pkey" PRIMARY KEY ("id")
      );

      -- Create indexes for digital_product_media
      CREATE INDEX IF NOT EXISTS "IDX_digital_product_media_digital_product_id" 
        ON "digital_product_media" (digital_product_id) 
        WHERE deleted_at IS NULL;
      
      CREATE INDEX IF NOT EXISTS "IDX_digital_product_media_deleted_at" 
        ON "digital_product_media" (deleted_at) 
        WHERE deleted_at IS NULL;

      -- Create digital_product_order table
      CREATE TABLE IF NOT EXISTS "digital_product_order" (
        "id" TEXT NOT NULL,
        "status" TEXT CHECK ("status" IN ('pending', 'sent')) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ NULL,
        CONSTRAINT "digital_product_order_pkey" PRIMARY KEY ("id")
      );

      -- Create index for digital_product_order
      CREATE INDEX IF NOT EXISTS "IDX_digital_product_order_deleted_at" 
        ON "digital_product_order" (deleted_at) 
        WHERE deleted_at IS NULL;

      -- Create join table for many-to-many relationship
      CREATE TABLE IF NOT EXISTS "digitalproduct_digitalproductorders" (
        "digital_product_order_id" TEXT NOT NULL,
        "digital_product_id" TEXT NOT NULL,
        CONSTRAINT "digitalproduct_digitalproductorders_pkey" 
          PRIMARY KEY ("digital_product_order_id", "digital_product_id")
      );

      -- Add foreign key constraints (only if they don't exist)
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'digital_product_media_digital_product_id_foreign'
        ) THEN
          ALTER TABLE "digital_product_media" 
            ADD CONSTRAINT "digital_product_media_digital_product_id_foreign" 
            FOREIGN KEY ("digital_product_id") 
            REFERENCES "digital_product" ("id") 
            ON UPDATE CASCADE 
            ON DELETE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'digitalproduct_digitalproductorders_digital_prod_c0c21_foreign'
        ) THEN
          ALTER TABLE "digitalproduct_digitalproductorders" 
            ADD CONSTRAINT "digitalproduct_digitalproductorders_digital_prod_c0c21_foreign" 
            FOREIGN KEY ("digital_product_order_id") 
            REFERENCES "digital_product_order" ("id") 
            ON UPDATE CASCADE 
            ON DELETE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'digitalproduct_digitalproductorders_digital_product_id_foreign'
        ) THEN
          ALTER TABLE "digitalproduct_digitalproductorders" 
            ADD CONSTRAINT "digitalproduct_digitalproductorders_digital_product_id_foreign" 
            FOREIGN KEY ("digital_product_id") 
            REFERENCES "digital_product" ("id") 
            ON UPDATE CASCADE 
            ON DELETE CASCADE;
        END IF;
      END $$;

      -- Create product_pdf_attachment table (for product PDF attachments)
      CREATE TABLE IF NOT EXISTS "product_pdf_attachment" (
        "id" TEXT NOT NULL,
        "product_id" TEXT NOT NULL,
        "file_id" TEXT NOT NULL,
        "filename" TEXT NOT NULL,
        "mime_type" TEXT NOT NULL DEFAULT 'application/pdf',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ NULL,
        CONSTRAINT "product_pdf_attachment_pkey" PRIMARY KEY ("id")
      );
      CREATE INDEX IF NOT EXISTS "IDX_product_pdf_attachment_product_id"
        ON "product_pdf_attachment" (product_id)
        WHERE deleted_at IS NULL;
      CREATE INDEX IF NOT EXISTS "IDX_product_pdf_attachment_deleted_at"
        ON "product_pdf_attachment" (deleted_at)
        WHERE deleted_at IS NULL;
    `

    await client.query(sql)
    console.log('✅ Digital product tables created successfully!')
  } catch (error) {
    console.error('❌ Error creating tables:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}