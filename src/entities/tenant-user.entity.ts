import { UserRole } from 'src/common/enums/user-role.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
 
@Entity()
export class TenantUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string; 
}
