import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestAddIsPublish1744559729854 implements MigrationInterface {
  name = 'TestAddIsPublish1744559729854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tests
      ADD COLUMN is_publish BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tests
      DROP COLUMN is_publish;
    `);
  }
}
