import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'test_assignment_id' })
  test_assignment_id: number;

  @Column({ name: 'question_id' })
  question_id: number;

  @Column({ name: 'answer_text', type: 'text' })
  answer_text: string;

  @Column({ default: 0, name: 'score' })
  score: number;
}
