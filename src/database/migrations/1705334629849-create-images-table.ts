import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateImagesTable1705334629849 implements MigrationInterface {
    name = 'CreateImagesTable1705334629849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`type\` smallint NOT NULL, \`mime_type\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_d46ee7424fcbbc896a457784f1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_d46ee7424fcbbc896a457784f1\` ON \`images\``);
        await queryRunner.query(`DROP TABLE \`images\``);
    }

}
