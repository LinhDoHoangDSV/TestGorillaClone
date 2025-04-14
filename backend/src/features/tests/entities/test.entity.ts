import { Question } from '../../questions/entities/question.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tests' })
export class Test {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, name: 'owner_id' })
  owner_id: number;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'test_time', nullable: false })
  test_time: number;

  @Column({ name: 'is_publish', type: 'boolean', default: false })
  is_publish: boolean;

  @Column({ name: 'deleted_at', default: null })
  deleted_at: Date | null;

  @OneToMany(() => Question, (question) => question.test, { cascade: true })
  questions: Question[];
}
