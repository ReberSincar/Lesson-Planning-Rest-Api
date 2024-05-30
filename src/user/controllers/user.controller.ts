import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/user/enums/role.enum';
import { GetUsersQueryDto } from '../dto/get-users-query.dto';
import { User } from '../models/user';
import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notAcceptableErrorSchema,
  notFoundErrorSchema,
  unauhorizedErrorSchema,
} from 'src/common/doc-models/error-schemas';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@Controller('users')
@ApiBearerAuth()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns the created user information.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: User })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notAcceptableErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user.toModel();
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns list of users.' })
  @ApiProduces('application/json')
  @ApiPaginatedResponse(User)
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getUsers(@Query() query: GetUsersQueryDto) {
    return this.userService.getUsers(query);
  }

  @Get('/self')
  @ApiOperation({ summary: 'Returns user with token.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: User })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  async getUser(@Request() req) {
    const user = await this.userService.getUserById(req.user.id);
    return user.toModel();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns user by given id.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: User })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  async getUserByAdmin(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    return user.toModel();
  }
}
