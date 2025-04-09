import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
