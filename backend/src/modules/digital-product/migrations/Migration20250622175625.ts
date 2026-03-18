import { Migration } from '@mikro-orm/migrations';

export class Migration20250622175625 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "digital_product" drop column if exists "price";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "digital_product" add column if not exists "price" integer null;`);
  }

}
