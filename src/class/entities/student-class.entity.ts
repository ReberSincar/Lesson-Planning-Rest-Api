import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ClassEntity } from './class.entity';

@Entity('student_class')
export class StudentClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @Column()
  classId: number;

  @ManyToOne(() => ClassEntity)
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @CreateDateColumn()
  createdAt: Date;
}
