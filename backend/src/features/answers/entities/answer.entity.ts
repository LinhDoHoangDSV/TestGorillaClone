import { Question } from '../../questions/entities/question.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'question_id', nullable: false })
  question_id: number;

  @Column('text', { name: 'option_text' })
  option_text: string;

  @Column({ name: 'is_correct', default: false })
  is_correct: boolean;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
}
