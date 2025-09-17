// admin.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('User', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Tenant, tenant => tenant.user, { cascade: true })
  @JoinColumn()  
  tenant: Tenant;

 @Column({ default: 'user' }) 
  role: string;
}
