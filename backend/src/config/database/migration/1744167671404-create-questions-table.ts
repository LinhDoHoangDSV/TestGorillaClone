import { QUESTION_TYPE } from '../../../common/constant';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionsTable1744167671404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'test_id',
            type: 'integer',
          },
          {
            name: 'question_text',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'question_type',
            type: 'enum',
            enum: Object.values(QUESTION_TYPE),
            isNullable: false,
          },
          {
            name: 'score',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('questions');
  }
}
