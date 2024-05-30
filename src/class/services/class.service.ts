import { Injectable } from '@nestjs/common';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/common/pagination/page-meta.dto';
import { CreateClassDto } from '../dto/create-class.dto';
import { ClassEntity } from '../entities/class.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { UpdateClassDto } from '../dto/update-class.dto';
import { StudentsClassOperationDto } from '../dto/students-class-operation.dto';
import { UserService } from 'src/user/services/user.service';
import { Role } from 'src/user/enums/role.enum';
import { StudentClassEntity } from '../entities/student-class.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { conflict, notFound, notAcceptable } from 'src/common/response/errors';
import { GradeLevelService } from 'src/grade-level/services/grade-level.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(ClassEntity) private classRepository: Repository<ClassEntity>,
    @InjectRepository(StudentClassEntity)
    private studentClassRepository: Repository<StudentClassEntity>,
    private userService: UserService,
    private gradeLevelService: GradeLevelService,
    private config: ConfigService,
  ) {}

  async createClass(body: CreateClassDto) {
    await this.gradeLevelService.getGradeLevelById(body.levelId);

    const isClassExist = await this.getClassByName(body.levelId, body.name);
    if (isClassExist) conflict('Class already exist');

    const classEntity = await this.classRepository.save(body);
    return this.getClassById(classEntity.id);
  }

  async getClassByName(levelId: number, name: string) {
    const result = await this.classRepository.findOneBy({
      levelId,
      name: name,
    });
    return result;
  }

  async getClassById(id: number) {
    const classEntity = await this.classRepository.findOne({
      relations: {
        gradeLevel: true,
      },
      where: { id },
    });
    if (!classEntity) return notFound('Class not found');
    return classEntity;
  }

  async getClasses(pageOptions: PageOptionsDto) {
    const coursesResult = await this.classRepository.findAndCount({
      relations: {
        gradeLevel: true,
      },
      skip: pageOptions.skip,
      take: pageOptions.take,
      order: {
        ['createdAt']: pageOptions.order,
      },
    });

    const meta = new PageMetaDto({
      itemCount: coursesResult[1],
      pageOptionsDto: pageOptions,
    });
    return new PageDto(coursesResult[0], meta);
  }

  async updateClass(id: number, body: UpdateClassDto) {
    await this.getClassById(id);

    if (body.levelId) {
      await this.gradeLevelService.getGradeLevelById(body.levelId);
    }

    await this.classRepository.save({ id, ...body });
    return this.getClassById(id);
  }

  async addStudentsToClass(body: StudentsClassOperationDto) {
    const maxStudentCount = this.config.get('MAX_STUDENT_COUNT_IN_CLASS');
    const classEntity = await this.getClassById(body.classId);
    if (classEntity.studentCount >= maxStudentCount)
      notAcceptable('Class is at capacity');

    if (classEntity.studentCount + body.students.length >= maxStudentCount)
      notAcceptable(
        `You can only add ${
          maxStudentCount - classEntity.studentCount
        } students to this class`,
      );

    const students = await this.userService.getUsersList(body.students);
    if (students.length !== body.students.length)
      notFound('Some students not found');

    const isAllStudents = students.every((e) => e.role === Role.STUDENT);
    if (!isAllStudents) notAcceptable('All users should be student');

    const isStudentsEnrolledClass = await this.isStudentsEnrolled(
      body.students,
    );

    if (isStudentsEnrolledClass)
      conflict('Some students already enrolled in the class');

    await this.dataSource.transaction(async (em: EntityManager) => {
      await em.save(
        StudentClassEntity,
        students.map((e) => {
          return {
            classId: body.classId,
            studentId: e.id,
          };
        }),
      );

      await em.save(ClassEntity, {
        studentCount: classEntity.studentCount + students.length,
      });
    });

    return { message: 'Students added to class' };
  }

  async removeStudentsFromClass(body: StudentsClassOperationDto) {
    const classEntity = await this.getClassById(body.classId);
    const students = await this.userService.getUsersList(body.students);
    if (students.length !== body.students.length)
      notFound('Some students not found');

    const isAllStudents = students.every((e) => e.role === Role.STUDENT);
    if (!isAllStudents) notAcceptable('All users should be student');

    const enrollCount = await this.isStudentsEnrolled(body.students);
    if (enrollCount !== body.students.length)
      conflict('Some students not enrolled in the class');

    await this.dataSource.transaction(async (em: EntityManager) => {
      await em.delete(StudentClassEntity, {
        classId: body.classId,
        studentId: In(body.students),
      });

      await em.save(ClassEntity, {
        studentCount: classEntity.studentCount - students.length,
      });
    });

    return { message: 'Students removed from class' };
  }

  async isStudentsEnrolled(students: number[]) {
    return this.studentClassRepository.count({
      where: {
        studentId: In(students),
      },
    });
  }

  async getUnEnrolledStudents() {
    const studentsQuery = `SELECT * FROM "user" WHERE "user".role='STUDENT' AND "user".id NOT IN(SELECT "studentId" FROM student_class);`;
    const students: UserEntity[] = await this.dataSource.query(studentsQuery);
    return students;
  }
}
