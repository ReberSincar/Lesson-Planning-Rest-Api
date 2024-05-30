import { Module } from '@nestjs/common';
import { ClassService } from './services/class.service';
import { ClassController } from './controllers/class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ClassEntity } from './entities/class.entity';
import { StudentClassEntity } from './entities/student-class.entity';
import { GradeLevelModule } from 'src/grade-level/grade-level.module';

@Module({
  imports: [
    UserModule,
    GradeLevelModule,
    TypeOrmModule.forFeature([ClassEntity, StudentClassEntity]),
  ],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [TypeOrmModule, ClassService],
})
export class ClassModule {}
