import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  Length,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(5)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3)
  code: string;

  @ApiProperty({ type: 'number', isArray: true })
  @IsDefined()
  @IsNumber(undefined, { each: true })
  teachers: number[];

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Min(1)
  hours: number;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  isOptional: boolean;
}
