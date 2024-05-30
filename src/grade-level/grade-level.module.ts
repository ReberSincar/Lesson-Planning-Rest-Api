import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { GradeLevelEntity } from './entities/grade-level.entity';
import { GradeLevelController } from './controllers/grade-level.controller';
import { GradeLevelService } from './services/grade-level.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([GradeLevelEntity])],
  controllers: [GradeLevelController],
  providers: [GradeLevelService],
  exports: [TypeOrmModule, GradeLevelService],
})
export class GradeLevelModule {}
