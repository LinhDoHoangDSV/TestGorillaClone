import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAnswer1744732764127 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              CREATE TABLE user_answers (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                test_assignment_id INTEGER NOT NULL,
                question_id INTEGER NOT NULL,
                answer_text TEXT NOT NULL,
                score INTEGER DEFAULT 0,
                CONSTRAINT fk_test_assignment FOREIGN KEY (test_assignment_id) REFERENCES test_assignment(id) ON DELETE CASCADE,
                CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
            )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_answers;`);
  }
}
