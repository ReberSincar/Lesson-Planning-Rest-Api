import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TeacherCourseEntity } from './teacher-course.entity';

@Entity('course')
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: 0 })
  teacherCount: number;

  @OneToMany(() => TeacherCourseEntity, (e) => e.course)
  teachers: TeacherCourseEntity[];

  @Column()
  hours: number;

  @Column({ default: false })
  isOptional: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
