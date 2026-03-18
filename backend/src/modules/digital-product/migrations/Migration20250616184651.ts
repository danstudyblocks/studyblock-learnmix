import { Migration } from '@mikro-orm/migrations';

export class Migration20250616184651 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "category_sub" drop constraint if exists "category_sub_category_top_id_foreign";`);

    this.addSql(`alter table if exists "digital_product" drop constraint if exists "digital_product_category_sub_id_foreign";`);

    this.addSql(`drop table if exists "category_top" cascade;`);

    this.addSql(`drop table if exists "category_sub" cascade;`);

    this.addSql(`drop index if exists "IDX_digital_product_category_sub_id";`);
    this.addSql(`alter table if exists "digital_product" drop column if exists "category_sub_id";`);

    this.addSql(`alter table if exists "digital_product" add column if not exists "category_top" text null, add column if not exists "category_sub" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "category_top" ("id" text not null, "name" text not null, "description" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "category_top_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_category_top_deleted_at" ON "category_top" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "category_sub" ("id" text not null, "name" text not null, "description" text null, "category_top_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "category_sub_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_category_sub_category_top_id" ON "category_sub" (category_top_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_category_sub_deleted_at" ON "category_sub" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "category_sub" add constraint "category_sub_category_top_id_foreign" foreign key ("category_top_id") references "category_top" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "digital_product" drop column if exists "category_top", drop column if exists "category_sub";`);

    this.addSql(`alter table if exists "digital_product" add column if not exists "category_sub_id" text not null;`);
    this.addSql(`alter table if exists "digital_product" add constraint "digital_product_category_sub_id_foreign" foreign key ("category_sub_id") references "category_sub" ("id") on update cascade on delete cascade;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_product_category_sub_id" ON "digital_product" (category_sub_id) WHERE deleted_at IS NULL;`);
  }

}
