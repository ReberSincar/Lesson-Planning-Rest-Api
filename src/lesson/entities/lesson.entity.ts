import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClassEntity } from 'src/class/entities/class.entity';
import { Workday } from '../enums/day.enum';
import { TeacherCourseEntity } from 'src/course/entities/teacher-course.entity';

@Entity('lesson')
export class LessonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherCourseId: number;

  @ManyToOne(() => TeacherCourseEntity)
  @JoinColumn({ name: 'teacherCourseId' })
  teacherCourse: TeacherCourseEntity;

  @Column()
  classId: number;

  @ManyToOne(() => ClassEntity)
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @Column({ type: 'enum', enumName: 'Workday', enum: Workday })
  day: Workday;

  @Column()
  lessonNumber: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
