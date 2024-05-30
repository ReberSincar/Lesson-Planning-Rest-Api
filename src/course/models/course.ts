import { ApiProperty } from '@nestjs/swagger';

export class Course {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  teacherCount: number;

  @ApiProperty()
  hours: number;

  @ApiProperty()
  isOptional: boolean;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
