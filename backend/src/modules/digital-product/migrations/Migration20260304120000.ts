import { Migration } from '@mikro-orm/migrations';

export class Migration20260304120000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_pdf_attachment" (
      "id" text not null,
      "product_id" text not null,
      "file_id" text not null,
      "filename" text not null,
      "mime_type" text not null default 'application/pdf',
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "product_pdf_attachment_pkey" primary key ("id")
    );`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_pdf_attachment_product_id" ON "product_pdf_attachment" (product_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_pdf_attachment_deleted_at" ON "product_pdf_attachment" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_product_pdf_attachment_product_id";`);
    this.addSql(`drop index if exists "IDX_product_pdf_attachment_deleted_at";`);
    this.addSql(`drop table if exists "product_pdf_attachment" cascade;`);
  }

}
