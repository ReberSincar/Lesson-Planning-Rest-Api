import { ApiProperty } from '@nestjs/swagger';

export class TeacherWorkHours {
  @ApiProperty()
  teacherId: number;

  @ApiProperty()
  teacherName: string;

  @ApiProperty()
  teacherSurname: string;

  @ApiProperty()
  courseId: number;

  @ApiProperty()
  courseName: string;

  @ApiProperty()
  courseCode: string;

  @ApiProperty()
  totalHours: number;
}
