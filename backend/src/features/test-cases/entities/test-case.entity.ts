import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'test_cases' })
export class TestCase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'question_id', nullable: false })
  question_id: number;

  @Column({ name: 'input' })
  input: string;

  @Column({ name: 'expected_output', nullable: false })
  expected_output: string;
}
