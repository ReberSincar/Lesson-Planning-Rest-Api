import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ClassService } from '../services/class.service';
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
import { CreateClassDto } from '../dto/create-class.dto';
import { PageOptionsDto } from 'src/common/pagination/page-meta.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import { Class } from '../models/class';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import {
  badRequestErrorSchema,
  unauhorizedErrorSchema,
  notFoundErrorSchema,
  conflictErrorSchema,
  internalServerErrorSchema,
} from 'src/common/doc-models/error-schemas';
import { User } from 'src/user/models/user';

@Controller('classes')
@ApiBearerAuth()
@ApiTags('Classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}
  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns created class.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: Class })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(conflictErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  createClass(@Body() body: CreateClassDto) {
    return this.classService.createClass(body);
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns classes with pagination.' })
  @ApiProduces('application/json')
  @ApiPaginatedResponse(Class)
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getClasss(@Query() pageOptions: PageOptionsDto) {
    return this.classService.getClasses(pageOptions);
  }

  @Get('unenroll-students')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Returns students which are not enrolled in any class.',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: User })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getUnEnrolledStudents() {
    return this.classService.getUnEnrolledStudents();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns class by given id.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: Class })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getClassById(@Param('id', ParseIntPipe) id: number) {
    return this.classService.getClassById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns updated class.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: Class })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  UpdateClass(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateClassDto,
  ) {
    return this.classService.updateClass(id, body);
  }
}
