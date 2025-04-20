import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTestAssignment1744923180007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE test_assignment ALTER COLUMN expired_invitation TYPE TIMESTAMP;`,
    );
    await queryRunner.query(
      `ALTER TABLE test_assignment ALTER COLUMN started_at TYPE TIMESTAMP;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE test_assignment ALTER COLUMN expired_invitation TYPE DATE;`,
    );
    await queryRunner.query(
      `ALTER TABLE test_assignment ALTER COLUMN started_at TYPE DATE;`,
    );
  }
}
