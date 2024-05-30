import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role } from 'src/user/enums/role.enum';
import { User } from '../models/user';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enumName: 'Role', enum: Role })
  role: Role;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  getName() {
    return `${this.firstName} ${this.lastName}`;
  }

  toModel(): User {
    return {
      id: this.id,
      role: this.role,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}
