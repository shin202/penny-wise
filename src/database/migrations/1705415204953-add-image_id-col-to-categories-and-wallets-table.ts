import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageIdColToCategoriesAndWalletsTable1705415204953 implements MigrationInterface {
    name = 'AddImageIdColToCategoriesAndWalletsTable1705415204953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_5336de31c6bef5b1e543d66d2bc\` ON \`categories\``);
        await queryRunner.query(`DROP INDEX \`FK_88cea2dc9c31951d06437879b40\` ON \`categories\``);
        await queryRunner.query(`DROP INDEX \`FK_df42bd8fe6eef389419c1d8a2cd\` ON \`wallets\``);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_88cea2dc9c31951d06437879b40\` FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_5336de31c6bef5b1e543d66d2bc\` FOREIGN KEY (\`image_id\`) REFERENCES \`images\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wallets\` ADD CONSTRAINT \`FK_df42bd8fe6eef389419c1d8a2cd\` FOREIGN KEY (\`image_id\`) REFERENCES \`images\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`FK_df42bd8fe6eef389419c1d8a2cd\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_5336de31c6bef5b1e543d66d2bc\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_88cea2dc9c31951d06437879b40\``);
        await queryRunner.query(`CREATE INDEX \`FK_df42bd8fe6eef389419c1d8a2cd\` ON \`wallets\` (\`image_id\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_88cea2dc9c31951d06437879b40\` ON \`categories\` (\`parent_id\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_5336de31c6bef5b1e543d66d2bc\` ON \`categories\` (\`image_id\`)`);
    }

}
