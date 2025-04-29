import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'initial_codes' })
export class InitialCode {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'question_id', nullable: false })
  question_id: number;

  @Column({ name: 'language_id', nullable: false })
  language_id: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'initial_code', nullable: false })
  initial_code: string;
}
