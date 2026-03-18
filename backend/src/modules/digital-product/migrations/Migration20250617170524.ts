import { Migration } from '@mikro-orm/migrations';

export class Migration20250617170524 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "digital_product" add column if not exists "isTemplate" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "digital_product" drop column if exists "isTemplate";`);
  }

}
