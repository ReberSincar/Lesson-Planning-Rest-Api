import { ApiProperty } from '@nestjs/swagger';
import { Workday } from '../enums/day.enum';

export class LessonPlan {
  @ApiProperty()
  MONDAY: LessonPlanItem[];

  @ApiProperty()
  TUESDAY: LessonPlanItem[];

  @ApiProperty()
  WEDNESDAY: LessonPlanItem[];

  @ApiProperty()
  THURSDAY: LessonPlanItem[];

  @ApiProperty()
  FRIDAY: LessonPlanItem[];
}

export class LessonPlanItem {
  @ApiProperty()
  courseId: number;

  @ApiProperty()
  course: string;

  @ApiProperty()
  courseCode: string;

  @ApiProperty()
  teacherId: number;

  @ApiProperty()
  teacher: string;

  @ApiProperty()
  classId: number;

  @ApiProperty()
  day: Workday;

  @ApiProperty()
  lessonNumber: number;
}
