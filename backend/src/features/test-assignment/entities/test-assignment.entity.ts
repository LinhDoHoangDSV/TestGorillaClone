import { TestAssignmentStatus } from 'src/common/constant';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'test_assignment' })
export class TestAssignment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @PrimaryColumn({ name: 'test_id' })
  test_id: number;

  @Column({ name: 'candidate_email' })
  candidate_email: string;

  @Column({ type: 'date', nullable: true, name: 'expired_invitation' })
  expired_invitation: Date;

  @Column({ type: 'date', nullable: true, name: 'started_at' })
  started_at: Date;

  @Column({ default: false, name: 'is_online' })
  is_online: boolean;

  @Column({ default: 0, name: 'score' })
  score: number;

  @Column({ length: 6, unique: true, name: 'code' })
  code: string;

  @Column({
    type: 'enum',
    enum: TestAssignmentStatus,
    default: TestAssignmentStatus.NOT_STARTED,
  })
  status: TestAssignmentStatus;
}
