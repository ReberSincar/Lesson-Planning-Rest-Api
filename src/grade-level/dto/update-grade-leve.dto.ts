import { CreateGradeLevelDto } from './create-grade-level.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateGradeLevelDto extends PartialType(CreateGradeLevelDto) {}
