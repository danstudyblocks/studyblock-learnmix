import { Migration } from '@mikro-orm/migrations';

export class Migration20251202182520 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "digital_product" add column if not exists "approval_status" text not null default 'pending';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "digital_product" drop column if exists "approval_status";`);
  }

}

