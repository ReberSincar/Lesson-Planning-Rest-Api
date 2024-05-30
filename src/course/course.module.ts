import { Module } from '@nestjs/common';
import { CourseService } from './services/course.service';
import { CourseController } from './controllers/course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { UserModule } from 'src/user/user.module';
import { TeacherCourseEntity } from './entities/teacher-course.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([CourseEntity, TeacherCourseEntity])],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [TypeOrmModule, CourseService],
})
export class CourseModule {}
