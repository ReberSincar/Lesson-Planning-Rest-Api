import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsDefined,
  IsNumber,
} from 'class-validator';

export class StudentsClassOperationDto {
  @ApiProperty()
  @IsDefined()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber(undefined, { each: true })
  students: number[];

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  classId: number;
}
