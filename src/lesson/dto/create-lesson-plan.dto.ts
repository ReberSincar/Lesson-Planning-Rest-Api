import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLessonPlanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  classId: number;
}
