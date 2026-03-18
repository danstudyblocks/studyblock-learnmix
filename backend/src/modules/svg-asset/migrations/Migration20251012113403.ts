import { Migration } from '@mikro-orm/migrations';

export class Migration20251012113403 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "svg_asset" ("id" text not null, "name" text not null, "description" text null, "creator_id" text null, "is_premium" boolean not null default false, "category_top" text null, "category_sub" text null, "tags" text[] null, "thumbnail" text null, "svg_url" text not null, "file_id" text not null, "mime_type" text not null default 'image/svg+xml', "file_size" integer null, "dimensions" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "svg_asset_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_svg_asset_deleted_at" ON "svg_asset" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "svg_asset" cascade;`);
  }

}
