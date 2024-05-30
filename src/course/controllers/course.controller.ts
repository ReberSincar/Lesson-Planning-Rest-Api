import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { CourseService } from '../services/course.service';
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
import { CreateCourseDto } from '../dto/create-course.dto';
import { PageOptionsDto } from 'src/common/pagination/page-meta.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../models/course';
import {
  badRequestErrorSchema,
  unauhorizedErrorSchema,
  notFoundErrorSchema,
  internalServerErrorSchema,
  conflictErrorSchema,
} from 'src/common/doc-models/error-schemas';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { User } from 'src/user/models/user';

@Controller('courses')
@ApiBearerAuth()
@ApiTags('Courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns created course.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: Course })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(conflictErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  createCourse(@Body() body: CreateCourseDto) {
    return this.courseService.createCourse(body);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns courses with pagination.' })
  @ApiProduces('application/json')
  @ApiPaginatedResponse(Course)
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getCourses(@Query() pageOptions: PageOptionsDto) {
    return this.courseService.getCourses(pageOptions);
  }

  @Get('courseless-teachers')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Returns teachers which are not teach course.',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: User })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getUnEnrolledStudents() {
    return this.courseService.getCourselessTeachers();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns courses by given id.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: Course })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getCourseById(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getCourseById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns updated course.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: Course })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(conflictErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  UpdateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, body);
  }

  @Get('/:id/teachers')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns teachers of course.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: User, isArray: true })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  @Roles(Role.ADMIN)
  getCourseTeachers(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getCourseTeachers(id);
  }
}
