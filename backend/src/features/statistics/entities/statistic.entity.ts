import { User } from 'src/features/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'total_invitation' })
  total_invitation: number;

  @Column({ name: 'active_assess' })
  active_assess: number;

  @Column({ name: 'total_assess_complete' })
  total_assess_complete: number;
}
