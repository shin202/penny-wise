import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIncomesTable1705499339269 implements MigrationInterface {
    name = 'CreateIncomesTable1705499339269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`incomes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`transaction_date\` datetime NOT NULL, \`notes\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, \`wallet_id\` int NULL, \`currency_id\` int NULL, \`category_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD \`income_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_6c0eb6a7fddfa836c6551c6ca87\` FOREIGN KEY (\`income_id\`) REFERENCES \`incomes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incomes\` ADD CONSTRAINT \`FK_400664fad260d8fa50ecb78ffe6\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incomes\` ADD CONSTRAINT \`FK_2a9a4e0d6e16c54bf92850fe2cb\` FOREIGN KEY (\`wallet_id\`) REFERENCES \`wallets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incomes\` ADD CONSTRAINT \`FK_d96e63b692a064568bdf4131e5f\` FOREIGN KEY (\`currency_id\`) REFERENCES \`currencies\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incomes\` ADD CONSTRAINT \`FK_aa542e88dd5eaece8243e470962\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incomes\` DROP FOREIGN KEY \`FK_aa542e88dd5eaece8243e470962\``);
        await queryRunner.query(`ALTER TABLE \`incomes\` DROP FOREIGN KEY \`FK_d96e63b692a064568bdf4131e5f\``);
        await queryRunner.query(`ALTER TABLE \`incomes\` DROP FOREIGN KEY \`FK_2a9a4e0d6e16c54bf92850fe2cb\``);
        await queryRunner.query(`ALTER TABLE \`incomes\` DROP FOREIGN KEY \`FK_400664fad260d8fa50ecb78ffe6\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_6c0eb6a7fddfa836c6551c6ca87\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP COLUMN \`income_id\``);
        await queryRunner.query(`DROP TABLE \`incomes\``);
    }

}
