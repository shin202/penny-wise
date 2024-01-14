import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCurrenciesTable1705240192374 implements MigrationInterface {
  name = 'CreateCurrenciesTable1705240192374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`currencies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`symbol\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`decimal_digits\` int NOT NULL, \`rounding\` int NOT NULL, \`name_plural\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_976da6960ec4f0c96c26e3dffa\` (\`name\`), UNIQUE INDEX \`IDX_9f8d0972aeeb5a2277e40332d2\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_9f8d0972aeeb5a2277e40332d2\` ON \`currencies\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_976da6960ec4f0c96c26e3dffa\` ON \`currencies\``,
    );
    await queryRunner.query(`DROP TABLE \`currencies\``);
  }
}
