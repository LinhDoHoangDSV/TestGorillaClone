import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTestAssignment1744964931637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE test_assignment ADD COLUMN count_exit INTEGER DEFAULT 0;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE test_assignment DROP COLUMN count_exit;`,
    );
  }
}
