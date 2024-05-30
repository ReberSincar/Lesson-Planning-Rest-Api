import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
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
import { CreateGradeLevelDto } from '../dto/create-grade-level.dto';
import { UpdateGradeLevelDto } from '../dto/update-grade-leve.dto';
import { GradeLevelService } from '../services/grade-level.service';
import { GradeLevelEntity } from '../entities/grade-level.entity';
import {
  badRequestErrorSchema,
  unauhorizedErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
} from 'src/common/doc-models/error-schemas';

@Controller('grade-levels')
@ApiBearerAuth()
@ApiTags('Grade Levels')
export class GradeLevelController {
  constructor(private readonly classService: GradeLevelService) {}
  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns the created grade level.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: GradeLevelEntity })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  createGradeLevel(@Body() body: CreateGradeLevelDto) {
    return this.classService.createGradeLevel(body);
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns all grade levels.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: GradeLevelEntity })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getGradeLevels() {
    return this.classService.getGradeLevels();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns grade level by given id.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: GradeLevelEntity })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  getGradeLevelById(@Param('id', ParseIntPipe) id: number) {
    return this.classService.getGradeLevelById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Returns update grade level.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: GradeLevelEntity })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notFoundErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  updateGradeLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGradeLevelDto,
  ) {
    return this.classService.updateGradeLevel(id, body);
  }
}
