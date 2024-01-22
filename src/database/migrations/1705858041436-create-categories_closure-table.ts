import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoriesClosureTable1705858041436 implements MigrationInterface {
    name = 'CreateCategoriesClosureTable1705858041436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`type\` smallint NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parentId\` int NULL, \`image_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_ea1e9c4eea91160dfdb4318778\` (\`id_ancestor\`), INDEX \`IDX_51fff5114cc41723e8ca36cf22\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_9a6f051e66982b5f0318981bcaa\` FOREIGN KEY (\`parentId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_5336de31c6bef5b1e543d66d2bc\` FOREIGN KEY (\`image_id\`) REFERENCES \`images\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories_closure\` ADD CONSTRAINT \`FK_ea1e9c4eea91160dfdb4318778d\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories_closure\` ADD CONSTRAINT \`FK_51fff5114cc41723e8ca36cf227\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories_closure\` DROP FOREIGN KEY \`FK_51fff5114cc41723e8ca36cf227\``);
        await queryRunner.query(`ALTER TABLE \`categories_closure\` DROP FOREIGN KEY \`FK_ea1e9c4eea91160dfdb4318778d\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_5336de31c6bef5b1e543d66d2bc\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_9a6f051e66982b5f0318981bcaa\``);
        await queryRunner.query(`DROP INDEX \`IDX_51fff5114cc41723e8ca36cf22\` ON \`categories_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_ea1e9c4eea91160dfdb4318778\` ON \`categories_closure\``);
        await queryRunner.query(`DROP TABLE \`categories_closure\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
    }

}
