import { Module } from '@nestjs/common';
import { LessonService } from './services/lesson.service';
import { LessonController } from './controllers/lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { LessonEntity } from './entities/lesson.entity';
import { ClassModule } from 'src/class/class.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    UserModule,
    ClassModule,
    CourseModule,
    TypeOrmModule.forFeature([LessonEntity]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [TypeOrmModule, LessonService],
})
export class LessonModule {}
