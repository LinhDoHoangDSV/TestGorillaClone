import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialCodesTable1745497443157
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE initial_codes (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                question_id INTEGER NOT NULL,
                language_id INTEGER NOT NULL,
                description TEXT,
                initial_code TEXT NOT NULL,
                CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
              );
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE initial_codes;`);
  }
}
