import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTestAssignment1744808539324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE test_assignment_status AS ENUM ('not_started', 'in_progress', 'completed');`,
    );

    await queryRunner.query(
      `CREATE TABLE test_assignment (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        test_id INTEGER NOT NULL,
        candidate_email VARCHAR(255) NOT NULL,
        expired_invitation DATE,
        started_at DATE,
        is_online BOOLEAN DEFAULT FALSE,
        score INTEGER DEFAULT 0,
        code VARCHAR(6) UNIQUE NOT NULL,
        status test_assignment_status DEFAULT 'not_started',
        CONSTRAINT fk_test FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
      );
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE test_assignment;`);
    await queryRunner.query(`DROP TYPE test_assignment_status;`);
  }
}
