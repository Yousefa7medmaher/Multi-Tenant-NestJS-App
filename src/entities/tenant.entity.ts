// tenant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user-public.entity';

@Entity('tenants', { schema: 'public' })
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  schemaName: string;

  @OneToOne(() => User, user => user.tenant)
  user: User;
}
