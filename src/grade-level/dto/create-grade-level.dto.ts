import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGradeLevelDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
