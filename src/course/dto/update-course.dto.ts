import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Length(5)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Length(3)
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsDefined()
  @IsBoolean()
  isOptional: boolean;
}
