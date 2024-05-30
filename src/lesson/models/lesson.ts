import { ApiProperty } from '@nestjs/swagger';
import { Class } from 'src/class/models/class';
import { Workday } from '../enums/day.enum';

export class Lesson {
  @ApiProperty()
  id: number;

  @ApiProperty()
  teacherCourseId: number;

  @ApiProperty()
  classId: number;

  @ApiProperty()
  class: Class;

  @ApiProperty()
  day: Workday;

  @ApiProperty()
  lessonNumber: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
