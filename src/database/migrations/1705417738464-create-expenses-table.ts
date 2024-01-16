import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpensesTable1705417738464 implements MigrationInterface {
  name = 'CreateExpensesTable1705417738464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`expenses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`transaction_date\` datetime NOT NULL, \`notes\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, \`wallet_id\` int NULL, \`currency_id\` int NULL, \`category_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`images\` ADD \`expense_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`images\` ADD CONSTRAINT \`FK_347841f7508c974e37f00bf7345\` FOREIGN KEY (\`expense_id\`) REFERENCES \`expenses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expenses\` ADD CONSTRAINT \`FK_49a0ca239d34e74fdc4e0625a78\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expenses\` ADD CONSTRAINT \`FK_cd9fc754ebf971b7f101756c9b2\` FOREIGN KEY (\`wallet_id\`) REFERENCES \`wallets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expenses\` ADD CONSTRAINT \`FK_560c9662c5564c5745c3ddf9983\` FOREIGN KEY (\`currency_id\`) REFERENCES \`currencies\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expenses\` ADD CONSTRAINT \`FK_5d1f4be708e0dfe2afa1a3c376c\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`expenses\` DROP FOREIGN KEY \`FK_5d1f4be708e0dfe2afa1a3c376c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`expenses\` DROP FOREIGN KEY \`FK_560c9662c5564c5745c3ddf9983\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`expenses\` DROP FOREIGN KEY \`FK_cd9fc754ebf971b7f101756c9b2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`expenses\` DROP FOREIGN KEY \`FK_49a0ca239d34e74fdc4e0625a78\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_347841f7508c974e37f00bf7345\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`images\` DROP COLUMN \`expense_id\``,
    );
    await queryRunner.query(`DROP TABLE \`expenses\``);
  }
}
