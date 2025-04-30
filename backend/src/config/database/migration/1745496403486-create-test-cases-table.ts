import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTestCasesTable1745496403486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE test_cases (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            question_id INTEGER NOT NULL,
            input TEXT,
            expected_output TEXT NOT NULL,
            CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
          );
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE test_cases;`);
  }
}
