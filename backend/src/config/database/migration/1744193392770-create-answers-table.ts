import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAnswersTable1744193392770 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'answers',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'question_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'option_text',
            type: 'text',
          },
          {
            name: 'is_correct',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('answers');
  }
}
