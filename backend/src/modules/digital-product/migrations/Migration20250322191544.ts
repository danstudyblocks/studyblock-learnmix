import { Migration } from '@mikro-orm/migrations';

export class Migration20250322191544 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "digital_product" add column if not exists "template_data" jsonb null, add column if not exists "creator_id" text null, add column if not exists "is_premium" boolean not null default false, add column if not exists "price" integer null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "digital_product" drop column if exists "template_data";');
    this.addSql('alter table if exists "digital_product" drop column if exists "creator_id";');
    this.addSql('alter table if exists "digital_product" drop column if exists "is_premium";');
    this.addSql('alter table if exists "digital_product" drop column if exists "price";');
  }

}
