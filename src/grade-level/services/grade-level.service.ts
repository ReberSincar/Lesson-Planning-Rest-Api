import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { conflict, notFound } from 'src/common/response/errors';
import { Repository } from 'typeorm';
import { CreateGradeLevelDto } from '../dto/create-grade-level.dto';
import { UpdateGradeLevelDto } from '../dto/update-grade-leve.dto';
import { GradeLevelEntity } from '../entities/grade-level.entity';

@Injectable()
export class GradeLevelService {
  constructor(
    @InjectRepository(GradeLevelEntity)
    private levelRepository: Repository<GradeLevelEntity>,
  ) {}

  async createGradeLevel(body: CreateGradeLevelDto) {
    await this.checkGradeLevelName(body.name);

    const gradeLevel = await this.levelRepository.save(body);
    return this.getGradeLevelById(gradeLevel.id);
  }

  async getGradeLevelById(id: number) {
    const gradeLevel = await this.levelRepository.findOneBy({ id });
    if (!gradeLevel) return notFound('Grade level not found');
    return gradeLevel;
  }

  async checkGradeLevelName(name: string) {
    const gradeLevel = await this.levelRepository.findOneBy({
      name,
    });
    if (gradeLevel) conflict('Grade level name already exist');
  }

  getGradeLevels() {
    return this.levelRepository.find();
  }

  async updateGradeLevel(id: number, body: UpdateGradeLevelDto) {
    await this.getGradeLevelById(id);
    return this.levelRepository.save({ id, ...body });
  }
}
