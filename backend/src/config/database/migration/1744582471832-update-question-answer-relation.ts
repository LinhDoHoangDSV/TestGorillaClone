import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class UpdateQuestionAnswerRelation1744582471832
  implements MigrationInterface
{
  name = 'UpdateQuestionAnswerRelation1744582471832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['question_id'],
        referencedTableName: 'questions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('questions');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('test_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('questions', foreignKey);
    }
  }
}
