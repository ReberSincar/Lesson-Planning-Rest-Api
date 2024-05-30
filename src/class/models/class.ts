import { ApiProperty } from '@nestjs/swagger';
import { GradeLevel } from 'src/grade-level/models/grade-level';

export class Class {
  @ApiProperty()
  id: number;

  @ApiProperty()
  levelId: number;

  @ApiProperty()
  gradeLevel: GradeLevel;

  @ApiProperty()
  name: string;

  @ApiProperty()
  studentCount: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
