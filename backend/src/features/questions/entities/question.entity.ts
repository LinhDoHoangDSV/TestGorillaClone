import { Test } from '../../tests/entities/test.entity';
import { QUESTION_TYPE } from '../../../common/constant';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from '../../answers/entities/answer.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'test_id' })
  test_id: number;

  @Column({ name: 'title' })
  title: string;

  @Column('text')
  question_text: string;

  @Column({ name: 'question_type', enum: Object.values(QUESTION_TYPE) })
  question_type: QUESTION_TYPE;

  @Column({ name: 'score' })
  score: number;

  @ManyToOne(() => Test, (test) => test.questions)
  test: Test;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];
}
