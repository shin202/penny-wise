import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1708416532642 implements MigrationInterface {
    name = 'InitSchema1708416532642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`email_verify_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`expires_at\` datetime NULL, \`is_used\` tinyint NULL DEFAULT 0, \`used_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, UNIQUE INDEX \`IDX_6d46e9b0dd82aecf90eacb145e\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`incomes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`transaction_date\` datetime NOT NULL, \`notes\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, \`wallet_id\` int NULL, \`currency_id\` int NULL, \`category_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`type\` smallint NOT NULL, \`mime_type\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`expense_id\` int NULL, \`income_id\` int NULL, UNIQUE INDEX \`IDX_d46ee7424fcbbc896a457784f1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`type\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parent_id\` int NULL, \`image_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`expenses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`transaction_date\` datetime NOT NULL, \`notes\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, \`wallet_id\` int NULL, \`currency_id\` int NULL, \`category_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`currencies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`symbol\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`decimal_digits\` int NOT NULL, \`rounding\` int NOT NULL, \`name_plural\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_976da6960ec4f0c96c26e3dffa\` (\`name\`), UNIQUE INDEX \`IDX_9f8d0972aeeb5a2277e40332d2\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`wallets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`balance\` decimal(10,2) NOT NULL, \`description\` varchar(255) NULL, \`status\` smallint NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, \`currency_id\` int NULL, \`image_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(20) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`is_verified\` tinyint NULL DEFAULT 0, \`email_verified_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`transaction_date\` datetime NOT NULL, \`transaction_type\` varchar(255) NOT NULL, \`transaction_id\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, \`wallet_id\` int NULL, \`category_id\` int NULL, \`currency_id\` int NULL, INDEX \`IDX_9162bf9ab4e31961a8f7932974\` (\`transaction_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`password_resets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_7e57f540b334d522f9cf5b16ca\` (\`email\`), UNIQUE INDEX \`IDX_9b34edd5264effbbc875c266a9\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_ea1e9c4eea91160dfdb4318778\` (\`id_ancestor\`), INDEX \`IDX_51fff5114cc41723e8ca36cf22\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`email_verify_tokens\` ADD CONSTRAINT \`FK_e8f29b6e3952ccf656572833599\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incomes\` ADD CONSTRAINT \`FK_400664fad260d8fa50ecb78ffe6\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incomes\` ADD CONSTRAINT \`FK_2a9a4e0d6e16c54bf92850fe2cb\` FOREIGN KEY (\`wallet_id\`) REFERENCES \`wallets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incomes\` ADD CONSTRAINT \`FK_d96e63b692a064568bdf4131e5f\` FOREIGN KEY (\`currency_id\`) REFERENCES \`currencies\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incomes\` ADD CONSTRAINT \`FK_aa542e88dd5eaece8243e470962\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_347841f7508c974e37f00bf7345\` FOREIGN KEY (\`expense_id\`) REFERENCES \`expenses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_6c0eb6a7fddfa836c6551c6ca87\` FOREIGN KEY (\`income_id\`) REFERENCES \`incomes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_88cea2dc9c31951d06437879b40\` FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_5336de31c6bef5b1e543d66d2bc\` FOREIGN KEY (\`image_id\`) REFERENCES \`images\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expenses\` ADD CONSTRAINT \`FK_49a0ca239d34e74fdc4e0625a78\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expenses\` ADD CONSTRAINT \`FK_cd9fc754ebf971b7f101756c9b2\` FOREIGN KEY (\`wallet_id\`) REFERENCES \`wallets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expenses\` ADD CONSTRAINT \`FK_560c9662c5564c5745c3ddf9983\` FOREIGN KEY (\`currency_id\`) REFERENCES \`currencies\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expenses\` ADD CONSTRAINT \`FK_5d1f4be708e0dfe2afa1a3c376c\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wallets\` ADD CONSTRAINT \`FK_92558c08091598f7a4439586cda\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wallets\` ADD CONSTRAINT \`FK_b3167c57663ae949d67436465b3\` FOREIGN KEY (\`currency_id\`) REFERENCES \`currencies\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wallets\` ADD CONSTRAINT \`FK_df42bd8fe6eef389419c1d8a2cd\` FOREIGN KEY (\`image_id\`) REFERENCES \`images\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_e9acc6efa76de013e8c1553ed2b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_0b171330be0cb621f8d73b87a9e\` FOREIGN KEY (\`wallet_id\`) REFERENCES \`wallets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_c9e41213ca42d50132ed7ab2b0f\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_b515faccedf1dc36ac4f78acc04\` FOREIGN KEY (\`currency_id\`) REFERENCES \`currencies\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories_closure\` ADD CONSTRAINT \`FK_ea1e9c4eea91160dfdb4318778d\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories_closure\` ADD CONSTRAINT \`FK_51fff5114cc41723e8ca36cf227\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories_closure\` DROP FOREIGN KEY \`FK_51fff5114cc41723e8ca36cf227\``);
        await queryRunner.query(`ALTER TABLE \`categories_closure\` DROP FOREIGN KEY \`FK_ea1e9c4eea91160dfdb4318778d\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_b515faccedf1dc36ac4f78acc04\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_c9e41213ca42d50132ed7ab2b0f\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_0b171330be0cb621f8d73b87a9e\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_e9acc6efa76de013e8c1553ed2b\``);
        await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`FK_df42bd8fe6eef389419c1d8a2cd\``);
        await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`FK_b3167c57663ae949d67436465b3\``);
        await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`FK_92558c08091598f7a4439586cda\``);
        await queryRunner.query(`ALTER TABLE \`expenses\` DROP FOREIGN KEY \`FK_5d1f4be708e0dfe2afa1a3c376c\``);
        await queryRunner.query(`ALTER TABLE \`expenses\` DROP FOREIGN KEY \`FK_560c9662c5564c5745c3ddf9983\``);
        await queryRunner.query(`ALTER TABLE \`expenses\` DROP FOREIGN KEY \`FK_cd9fc754ebf971b7f101756c9b2\``);
        await queryRunner.query(`ALTER TABLE \`expenses\` DROP FOREIGN KEY \`FK_49a0ca239d34e74fdc4e0625a78\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_5336de31c6bef5b1e543d66d2bc\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_88cea2dc9c31951d06437879b40\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_6c0eb6a7fddfa836c6551c6ca87\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_347841f7508c974e37f00bf7345\``);
        await queryRunner.query(`ALTER TABLE \`incomes\` DROP FOREIGN KEY \`FK_aa542e88dd5eaece8243e470962\``);
        await queryRunner.query(`ALTER TABLE \`incomes\` DROP FOREIGN KEY \`FK_d96e63b692a064568bdf4131e5f\``);
        await queryRunner.query(`ALTER TABLE \`incomes\` DROP FOREIGN KEY \`FK_2a9a4e0d6e16c54bf92850fe2cb\``);
        await queryRunner.query(`ALTER TABLE \`incomes\` DROP FOREIGN KEY \`FK_400664fad260d8fa50ecb78ffe6\``);
        await queryRunner.query(`ALTER TABLE \`email_verify_tokens\` DROP FOREIGN KEY \`FK_e8f29b6e3952ccf656572833599\``);
        await queryRunner.query(`DROP INDEX \`IDX_51fff5114cc41723e8ca36cf22\` ON \`categories_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_ea1e9c4eea91160dfdb4318778\` ON \`categories_closure\``);
        await queryRunner.query(`DROP TABLE \`categories_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_9b34edd5264effbbc875c266a9\` ON \`password_resets\``);
        await queryRunner.query(`DROP INDEX \`IDX_7e57f540b334d522f9cf5b16ca\` ON \`password_resets\``);
        await queryRunner.query(`DROP TABLE \`password_resets\``);
        await queryRunner.query(`DROP INDEX \`IDX_9162bf9ab4e31961a8f7932974\` ON \`transactions\``);
        await queryRunner.query(`DROP TABLE \`transactions\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`wallets\``);
        await queryRunner.query(`DROP INDEX \`IDX_9f8d0972aeeb5a2277e40332d2\` ON \`currencies\``);
        await queryRunner.query(`DROP INDEX \`IDX_976da6960ec4f0c96c26e3dffa\` ON \`currencies\``);
        await queryRunner.query(`DROP TABLE \`currencies\``);
        await queryRunner.query(`DROP TABLE \`expenses\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_d46ee7424fcbbc896a457784f1\` ON \`images\``);
        await queryRunner.query(`DROP TABLE \`images\``);
        await queryRunner.query(`DROP TABLE \`incomes\``);
        await queryRunner.query(`DROP INDEX \`IDX_6d46e9b0dd82aecf90eacb145e\` ON \`email_verify_tokens\``);
        await queryRunner.query(`DROP TABLE \`email_verify_tokens\``);
    }

}
