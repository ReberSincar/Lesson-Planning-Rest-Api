import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { LessonService } from '../services/lesson.service';
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
import {
  badRequestErrorSchema,
  unauhorizedErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
} from 'src/common/doc-models/error-schemas';
import { ResponseModel } from 'src/common/response/response-model';
import { TeacherWorkHours } from '../models/teacher-work-hours';
import { LessonPlan } from '../models/lesson-plan';

@Controller('lessons')
@ApiBearerAuth()
@ApiTags('Lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Creates lesson plans for all classes and returns message.',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: ResponseModel })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  createLessonPlan() {
    return this.lessonService.createLessonPlan();
  }

  @Get('/total-works')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Returns teachers weekly total working hours.',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: TeacherWorkHours })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getTeachersWorkHours() {
    return this.lessonService.getTeachersTotalHours();
  }

  @Get('/students')
  @Roles(Role.STUDENT)
  @ApiOperation({
    summary: 'Returns student lesson plan.',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: LessonPlan })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getStudentLessonPlan(@Request() request: any) {
    return this.lessonService.getStudentLessonPlan(request.user.id);
  }

  @Get('/teachers')
  @Roles(Role.TEACHER)
  @ApiOperation({
    summary: 'Returns teachers lesson plan.',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: LessonPlan })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getTeacherLessonPlan(@Request() request: any) {
    return this.lessonService.getTeacherLessonPlan(request.user.id);
  }

  @Get('/classes/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Returns class lesson plan.',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: LessonPlan })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getClassLessonPlan(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.getClassLessonPlan(id);
  }
}
