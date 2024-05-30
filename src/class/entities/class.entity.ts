import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentClassEntity } from './student-class.entity';
import { GradeLevelEntity } from 'src/grade-level/entities/grade-level.entity';

@Entity("class")
@Index(['levelId', 'name'])
export class ClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  levelId: number;

  @ManyToOne(() => GradeLevelEntity)
  @JoinColumn({ name: 'levelId' })
  gradeLevel: GradeLevelEntity;

  @Column()
  name: string;

  @Column({ default: 0 })
  studentCount: number;

  @OneToMany(() => StudentClassEntity, (e) => e.class)
  students: StudentClassEntity[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
