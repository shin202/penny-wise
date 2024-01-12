import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordResetsTable1705081687001
  implements MigrationInterface
{
  name = 'CreatePasswordResetsTable1705081687001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`password_resets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_7e57f540b334d522f9cf5b16ca\` (\`email\`), UNIQUE INDEX \`IDX_9b34edd5264effbbc875c266a9\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_9b34edd5264effbbc875c266a9\` ON \`password_resets\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7e57f540b334d522f9cf5b16ca\` ON \`password_resets\``,
    );
    await queryRunner.query(`DROP TABLE \`password_resets\``);
  }
}
