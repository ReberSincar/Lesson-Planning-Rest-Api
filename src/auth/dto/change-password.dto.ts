import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  userId: number;

  @ApiProperty({ example: 'Password123' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'NewPassword321' })
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ example: 'NewPassword321' })
  @IsNotEmpty()
  newPasswordAgain: string;
}
