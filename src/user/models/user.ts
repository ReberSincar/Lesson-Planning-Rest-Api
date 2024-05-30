import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/user/enums/role.enum';

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;
}
