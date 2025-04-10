import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'deleted_at', default: null })
  deleted_at: Date | null;
}
