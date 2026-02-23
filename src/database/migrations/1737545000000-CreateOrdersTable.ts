import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateOrdersTable1737545000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create OrderStatus enum if not exists
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "orders_status_enum" AS ENUM(
          'PENDING', 
          'CONFIRMED', 
          'PROCESSING', 
          'SHIPPED', 
          'DELIVERED', 
          'CANCELLED'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create PaymentStatus enum if not exists
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "orders_payment_status_enum" AS ENUM(
          'PENDING', 
          'PAID', 
          'FAILED', 
          'REFUNDED'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create orders table if not exists
    const tableExists = await queryRunner.hasTable('orders');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'order_number',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
            default: "'PENDING'",
            isNullable: false,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'shipping_address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'payment_method',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'payment_status',
            type: 'enum',
            enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
            default: "'PENDING'",
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
        }),
        true
      );

      // Add foreign key to users table
      await queryRunner.createForeignKey(
        'orders',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    const table = await queryRunner.getTable('orders');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('orders', foreignKey);
    }

    // Drop orders table
    await queryRunner.dropTable('orders');

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_payment_status_enum"`);
  }
}
