import { QUESTION_TYPE } from '../../../common/constant';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'test_id' })
  test_id: number;

  @Column('text')
  question_text: string;

  @Column({ name: 'question_type', enum: Object.values(QUESTION_TYPE) })
  question_type: QUESTION_TYPE;

  @Column({ name: 'score' })
  score: number;
}
