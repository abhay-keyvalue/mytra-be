import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateOrderItemsTable1737545100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create order_items table if not exists
    const tableExists = await queryRunner.hasTable('order_items');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'order_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
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

      // Add foreign key to orders table (CASCADE on delete)
      await queryRunner.createForeignKey(
        'order_items',
        new TableForeignKey({
          columnNames: ['order_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'orders',
          onDelete: 'CASCADE',
        })
      );

      // Add foreign key to products table (RESTRICT on delete)
      await queryRunner.createForeignKey(
        'order_items',
        new TableForeignKey({
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'RESTRICT',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const table = await queryRunner.getTable('order_items');
    
    const orderForeignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('order_id') !== -1
    );
    if (orderForeignKey) {
      await queryRunner.dropForeignKey('order_items', orderForeignKey);
    }

    const productForeignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('product_id') !== -1
    );
    if (productForeignKey) {
      await queryRunner.dropForeignKey('order_items', productForeignKey);
    }

    // Drop order_items table
    await queryRunner.dropTable('order_items');
  }
}
