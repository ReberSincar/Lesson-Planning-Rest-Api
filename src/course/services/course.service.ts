import { Injectable } from '@nestjs/common';
import { conflict, notAcceptable, notFound } from 'src/common/response/errors';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/common/pagination/page-meta.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseEntity } from '../entities/course.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { UserService } from 'src/user/services/user.service';
import { Role } from 'src/user/enums/role.enum';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { TeacherCourseEntity } from '../entities/teacher-course.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(TeacherCourseEntity)
    private teacherCourseRepository: Repository<TeacherCourseEntity>,
    private userService: UserService,
  ) {}

  async createCourse(body: CreateCourseDto) {
    const users = await this.userService.getUsersList(body.teachers);
    if (users.find((e) => e.role !== Role.TEACHER))
      notAcceptable('User not acceptable for teacher');

    const isCodeUnique = await this.isCourseCodeUnique(body.code);
    if (!isCodeUnique) conflict('Course code already using');

    const teacherCourses = await this.teacherCourseRepository.findBy({
      teacherId: In(body.teachers),
    });

    if (teacherCourses.length > 0) conflict('Some teachers already has course');

    const course = await this.dataSource.transaction(
      async (em: EntityManager) => {
        const course = await em.save(CourseEntity, {
          name: body.name,
          code: body.code,
          hours: body.hours,
          isOptional: body.isOptional,
        });

        await em.save(
          TeacherCourseEntity,
          body.teachers.map((e) => {
            return {
              courseId: course.id,
              teacherId: e,
            };
          }),
        );
        return course;
      },
    );

    return course;
  }

  private async isCourseCodeUnique(code: string) {
    const result = await this.courseRepository.countBy({ code });
    return !result;
  }

  async getCourseById(id: number) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) return notFound('Course not found');
    return course;
  }

  async getCourses(pageOptions: PageOptionsDto) {
    const coursesResult = await this.courseRepository.findAndCount({
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

  async updateCourse(id: number, body: UpdateCourseDto) {
    const course = await this.getCourseById(id);

    if (body.code) {
      const isCodeUnique = await this.isCourseCodeUnique(body.code);
      if (!isCodeUnique) conflict('Course code already using');
    }

    course.name = body.name;
    course.code = body.code;
    course.isOptional = body.isOptional;
    return this.courseRepository.save(course);
  }

  async getCourseTeachers(id: number) {
    const teacherCourses = await this.teacherCourseRepository.find({
      relations: {
        teacher: true,
      },
      where: { courseId: id },
    });
    return teacherCourses.map((e) => e.teacher.toModel());
  }

  async getCourselessTeachers() {
    const teachersQuery = `SELECT * FROM "user" WHERE "user".role='TEACHER' AND "user".id NOT IN(SELECT "teacherId" FROM "teacher_course");`;
    const teachers: UserEntity[] = await this.dataSource.query(teachersQuery);
    return teachers;
  }
}
