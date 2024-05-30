import { Injectable } from '@nestjs/common';
import { LessonEntity } from '../entities/lesson.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Not, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Workday } from '../enums/day.enum';
import { ClassEntity } from 'src/class/entities/class.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CourseEntity } from 'src/course/entities/course.entity';
import { Role } from 'src/user/enums/role.enum';
import { TeacherWorkHours } from '../models/teacher-work-hours';
import { LessonPlan, LessonPlanItem } from '../models/lesson-plan';
import { StudentClassEntity } from 'src/class/entities/student-class.entity';
import { notFound } from 'src/common/response/errors';

@Injectable()
export class LessonService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ClassEntity)
    private classRepository: Repository<ClassEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(StudentClassEntity)
    private studentClassRepository: Repository<StudentClassEntity>,
    private config: ConfigService,
  ) {}

  hoursPerWeek = parseInt(this.config.get('TEACHER_WEEKLY_WORKING_HOURS'));
  hoursPerDay = parseInt(this.config.get('TEACHER_DAILY_WORKING_HOURS'));
  lessonHourPerDay = parseInt(this.config.get('MAX_LESSON_HOUR_PER_DAY'));

  async createLessonPlan() {
    const classes = await this.classRepository.find();
    if (!classes.length) notFound('No classes found');

    const teachers = await this.userRepository.findBy({ role: Role.TEACHER });
    if (!teachers.length) notFound('No teachers found');

    const courses = await this.courseRepository.find({
      relations: { teachers: true },
    });
    if (!courses.length) notFound('No courses found');

    let teachersData = this.initTeachersData(teachers);
    let coursesData = this.initCoursesData(classes, courses);
    let lessonsData = this.initLessonsData(classes);

    const days = Object.values(Workday);

    await this.dataSource.transaction(async (em: EntityManager) => {
      await this.deleteOldLessonPlans(em);

      for (const classItem of classes) {
        for (const day of days) {
          let currentLessonIndex = 0;
          for (const course of courses) {
            const availableCourses = this.getAvailableCourses(
              coursesData,
              classItem.id,
            );
            const courseDetail = availableCourses.find(
              (e) => e.id === course.id,
            );
            if (!courseDetail || courseDetail.hour === 0) continue;

            const isDailyAvailable = this.checkCourseDailyAvailable(
              lessonsData,
              course.id,
              classItem.id,
              day,
              currentLessonIndex + 1,
            );
            if (!isDailyAvailable) continue;

            for (
              let index = 0;
              index <
              (courseDetail.hour > 1
                ? this.lessonHourPerDay
                : courseDetail.hour);
              index++
            ) {
              const availableTeachers = this.getAvailableTeachers(
                teachersData,
                day,
                currentLessonIndex + 1,
              );

              const selectedTeacher = course.teachers.find((e) =>
                availableTeachers.includes(e.teacherId),
              );

              if (!selectedTeacher) continue;

              const lesson = new LessonEntity();
              lesson.classId = classItem.id;
              lesson.teacherCourseId = selectedTeacher.id;
              lesson.teacherCourse = selectedTeacher;
              lesson.day = day;
              lesson.lessonNumber = currentLessonIndex + 1;

              await em.save(lesson);

              if (currentLessonIndex >= this.hoursPerDay) break;
              currentLessonIndex++;

              // Update statistics
              teachersData = this.updateTeachersData(lesson, teachersData);
              lessonsData = this.updateLessonsData(lesson, lessonsData);
              coursesData = this.updateCoursesData(lesson, coursesData);
            }

            if (currentLessonIndex >= this.hoursPerDay) break;
          }
        }
      }
    });

    return { message: 'Lessons plans created' };
  }

  private initTeachersData(teachers: UserEntity[]) {
    const teachersData = new Map<string, any>();
    for (const teacher of teachers) {
      teachersData[`${teacher.id}`] = {};
      teachersData[`${teacher.id}`]['weeklyHours'] = 0;
      for (const day of Object.values(Workday)) {
        teachersData[`${teacher.id}`][`${day}`] = {
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
          6: null,
          7: null,
          8: null,
        };
      }
    }

    return teachersData;
  }

  private initLessonsData(classes: ClassEntity[]) {
    const lessonsData = new Map<string, any>();
    for (const classItem of classes) {
      lessonsData[`${classItem.id}`] = {};
      for (const day of Object.values(Workday)) {
        lessonsData[`${classItem.id}`][`${day}`] = {
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
          6: null,
          7: null,
          8: null,
        };
      }
    }

    return lessonsData;
  }

  private initCoursesData(classes: ClassEntity[], courses: CourseEntity[]) {
    const coursesData = new Map<string, any>();
    for (const course of courses) {
      coursesData[`${course.id}`] = {};
      for (const classItem of classes) {
        coursesData[`${course.id}`][`${classItem.id}`] = {
          courseHours: course.hours,
          totalHours: 0,
        };
      }
    }

    return coursesData;
  }

  private updateTeachersData(
    lesson: LessonEntity,
    teachersData: Map<string, any>,
  ) {
    teachersData[`${lesson.teacherCourse.teacherId}`]['weeklyHours']++;
    teachersData[`${lesson.teacherCourse.teacherId}`][`${lesson.day}`][
      `${lesson.lessonNumber}`
    ] = lesson.classId;

    return teachersData;
  }

  private updateLessonsData(
    lesson: LessonEntity,
    lessonsData: Map<string, any>,
  ) {
    lessonsData[`${lesson.classId}`][`${lesson.day}`][
      `${lesson.lessonNumber}`
    ] = lesson.teacherCourse.courseId;
    return lessonsData;
  }

  private updateCoursesData(
    lesson: LessonEntity,
    coursesData: Map<string, any>,
  ) {
    coursesData[`${lesson.teacherCourse.courseId}`][`${lesson.classId}`]
      .totalHours++;

    return coursesData;
  }

  private getAvailableTeachers(
    teachersData: Map<string, any>,
    day: Workday,
    lessonNumber: number,
  ) {
    const teachers = [];
    for (const [key, value] of Object.entries(teachersData)) {
      const dailyWorkHours = Object.values(value[`${day}`]).filter(
        (e) => e !== null,
      ).length;
      if (
        value.weeklyHours < this.hoursPerWeek &&
        dailyWorkHours < this.hoursPerDay &&
        value[`${day}`][`${lessonNumber}`] === null
      ) {
        teachers.push(parseInt(key));
      }
    }
    return teachers;
  }

  private getAvailableCourses(coursesData: Map<string, any>, classId: number) {
    const courses: { id: number; hour: number }[] = [];
    for (const [key, value] of Object.entries(coursesData)) {
      const courseHours = value[`${classId}`].courseHours;
      const totalHours = value[classId].totalHours;
      if (courseHours > totalHours) {
        courses.push({ id: parseInt(key), hour: courseHours - totalHours });
      }
    }
    return courses;
  }

  private checkCourseDailyAvailable(
    lessonsData: Map<string, any>,
    courseId: number,
    classId: number,
    day: Workday,
    lessonNumber: number,
  ) {
    for (const lesson of Object.values(lessonsData)) {
      if (lesson[`${day}`][`${lessonNumber}`] === courseId) {
        return false;
      }
    }

    const dayLessons = lessonsData[classId][`${day}`];
    const dayCourseLessonCount = Object.values(dayLessons).filter(
      (e) => e === courseId,
    ).length;

    return dayCourseLessonCount < this.lessonHourPerDay;
  }

  async getClassLessonPlan(classId: number) {
    const lessons = await this.lessonRepository.find({
      relations: {
        teacherCourse: {
          course: true,
          teacher: true,
        },
      },
      where: {
        classId,
      },
      order: {
        lessonNumber: 'ASC',
      },
    });

    const lessonPlan: LessonPlan = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
    };

    for (const lesson of lessons) {
      const item: LessonPlanItem = {
        courseId: lesson.teacherCourse.courseId,
        course: lesson.teacherCourse.course.name,
        courseCode: lesson.teacherCourse.course.code,
        teacherId: lesson.teacherCourse.teacherId,
        teacher: lesson.teacherCourse.teacher.getName(),
        classId: lesson.classId,
        day: lesson.day,
        lessonNumber: lesson.lessonNumber,
      };
      lessonPlan[`${lesson.day}`].push(item);
    }

    return this.fillEmptyLessons(lessonPlan);
  }

  private fillEmptyLessons(lessonPlan: LessonPlan) {
    for (const [day, lessons] of Object.entries(lessonPlan)) {
      const lessonNumbers = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
      };

      for (const lesson of lessons) {
        lessonNumbers[lesson.lessonNumber] = true;
      }

      const emptyLessons = Object.entries(lessonNumbers).filter(([k, v]) => !v);
      for (const [k, v] of emptyLessons) {
        const item: LessonPlanItem = {
          courseId: null,
          course: 'Empty Lesson',
          courseCode: null,
          teacherId: null,
          teacher: null,
          classId: null,
          day: null,
          lessonNumber: parseInt(k),
        };
        lessons.push(item);
      }

      lessonPlan[day] = lessons;
    }

    return lessonPlan;
  }

  async getTeachersTotalHours() {
    const query = `
    SELECT "teacher_course"."teacherId" AS "teacherId",
    "user"."firstName" AS "teacherName",
    "user"."lastName" AS "teacherSurname",
    "course"."id" AS "courseId",
    "course"."name" AS "courseName",
    COUNT("lesson"."lessonNumber")::integer AS "totalHours"
    FROM "lesson"
    LEFT JOIN "teacher_course" ON "teacher_course"."id" = "lesson"."teacherCourseId"
    LEFT JOIN "course" ON "teacher_course"."courseId" = "course"."id"
    LEFT JOIN "user" ON "teacher_course"."teacherId" = "user"."id"
    GROUP BY "teacher_course"."teacherId",
      "lesson"."teacherCourseId",
      "course"."id",
      "course"."name",
      "user"."firstName",
      "user"."lastName"
    ORDER BY "totalHours" DESC;
    `;

    const result: TeacherWorkHours[] = await this.dataSource.query(query);
    return result;
  }

  private async deleteOldLessonPlans(em?: EntityManager) {
    em = em ?? this.lessonRepository.manager;
    await em.delete(LessonEntity, {
      id: Not(-1),
    });
  }

  async getStudentLessonPlan(studentId: number) {
    const studentClass = await this.studentClassRepository.findOneBy({
      studentId: studentId,
    });
    if (!studentClass) notFound('Student not enrolled in any class');

    return this.getClassLessonPlan(studentClass.classId);
  }

  async getTeacherLessonPlan(teacherId: number) {
    const lessons = await this.lessonRepository.find({
      relations: {
        teacherCourse: {
          course: true,
          teacher: true,
        },
      },
      where: {
        teacherCourse: {
          teacherId,
        },
      },
      order: {
        lessonNumber: 'ASC',
      },
    });

    const lessonPlan: LessonPlan = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
    };

    for (const lesson of lessons) {
      const item: LessonPlanItem = {
        courseId: lesson.teacherCourse.courseId,
        course: lesson.teacherCourse.course.name,
        courseCode: lesson.teacherCourse.course.code,
        teacherId: lesson.teacherCourse.teacherId,
        teacher: lesson.teacherCourse.teacher.getName(),
        classId: lesson.classId,
        day: lesson.day,
        lessonNumber: lesson.lessonNumber,
      };
      lessonPlan[`${lesson.day}`].push(item);
    }
    return lessonPlan;
  }
}
