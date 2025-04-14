import { MigrationInterface, QueryRunner } from 'typeorm';

export class QuestionsAddTitleField1744600281469 implements MigrationInterface {
  name = 'QuestionsAddTitleField1744600281469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE questions
          ADD COLUMN title VARCHAR(255);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE questions
          DROP COLUMN title;
        `);
  }
}
