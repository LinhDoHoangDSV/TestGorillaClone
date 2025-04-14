import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreateTestQuestionRelation1744557734589
  implements MigrationInterface
{
  name = 'CreateTestQuestionRelation1744557734589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['test_id'],
        referencedTableName: 'tests',
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
