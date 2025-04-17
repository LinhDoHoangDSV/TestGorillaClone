import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStatistics1744732185784 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE statistics (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            user_id INTEGER NOT NULL,
            total_invitation INTEGER DEFAULT 0,
            active_assess INTEGER DEFAULT 0,
            total_assess_complete INTEGER DEFAULT 0,
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE statistics`);
  }
}
