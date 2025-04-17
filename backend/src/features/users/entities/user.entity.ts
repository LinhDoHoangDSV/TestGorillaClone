import { Role } from 'src/features/roles/entities/role.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Role, (role) => role.id, { onDelete: 'RESTRICT' })
  @Column({ name: 'role_id' })
  role_id: number;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'first_name' })
  first_name: string;

  @Column({ name: 'last_name' })
  last_name: string;

  @Column({ name: 'phone_number' })
  phone_number: string;

  @Column({ name: 'refresh_token' })
  refresh_token: string;
}
