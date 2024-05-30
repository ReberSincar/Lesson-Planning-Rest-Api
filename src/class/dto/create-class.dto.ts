import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateClassDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  levelId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1)
  name: string;
}
