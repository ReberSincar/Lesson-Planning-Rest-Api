import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/pagination/page-meta.dto';
import { Role } from 'src/user/enums/role.enum';

export class GetUsersQueryDto extends PageOptionsDto {
  @ApiProperty({ enum: Role, example: Role.STUDENT })
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
