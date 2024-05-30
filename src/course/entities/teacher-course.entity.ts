import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { LessonEntity } from 'src/lesson/entities/lesson.entity';

@Entity('teacher_course')
export class TeacherCourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherId: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'teacherId' })
  teacher: UserEntity;

  @Column()
  courseId: number;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'courseId' })
  course: CourseEntity;

  @OneToMany(() => LessonEntity, (e) => e.teacherCourse)
  lesson: LessonEntity;

  @CreateDateColumn()
  createdAt: Date;
}
