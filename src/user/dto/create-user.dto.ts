import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString, Length } from 'class-validator';
import { Role } from 'src/user/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ enum: Role, example: Role.STUDENT })
  @IsIn([Role.TEACHER, Role.STUDENT])
  role: Role;

  @ApiProperty({ example: 'Password123' })
  @Length(6)
  password: string;

  @ApiProperty({ example: 'Firstname' })
  @IsString()
  @Length(2)
  firstName: string;

  @ApiProperty({ example: 'Lastname' })
  @IsString()
  @Length(2)
  lastName: string;

  @ApiProperty({ example: 'example@email.com' })
  @IsEmail()
  email: string;
}
