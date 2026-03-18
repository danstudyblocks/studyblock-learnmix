import { Migration } from '@mikro-orm/migrations';

export class Migration20250617025638 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "digital_product" add column if not exists "show_in_studio" boolean not null default false, add column if not exists "tags" text[] null, add column if not exists "thumbnail" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "digital_product" drop column if exists "show_in_studio", drop column if exists "tags", drop column if exists "thumbnail";`);
  }

}
