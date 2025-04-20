import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1744731008210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            role_id INTEGER NOT NULL,
            email VARCHAR(255) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            phone_number VARCHAR(15),
            refresh_token VARCHAR(255),
            CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP TABLE users;
        `);
  }
}
