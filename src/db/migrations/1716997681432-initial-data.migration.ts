import { ClassEntity } from 'src/class/entities/class.entity';
import { StudentClassEntity } from 'src/class/entities/student-class.entity';
import { PasswordUtils } from 'src/common/utils/password.utils';
import { CourseEntity } from 'src/course/entities/course.entity';
import { TeacherCourseEntity } from 'src/course/entities/teacher-course.entity';
import { GradeLevelEntity } from 'src/grade-level/entities/grade-level.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enums/role.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDataMigration1716997681432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(UserEntity);
    const teachers = await userRepository.save(this.getTeachersData());
    const students = await userRepository.save(this.getStudentsData());

    const gradeLevelRepository = queryRunner.manager.getRepository(GradeLevelEntity);
    const gradeLevels = await gradeLevelRepository.save([
      { name: '11' },
      { name: '12' },
    ]);

    const classRepository = queryRunner.manager.getRepository(ClassEntity);
    const classes = await classRepository.save([
      { levelId: gradeLevels[0].id, name: 'A', studentCount: 20 },
      { levelId: gradeLevels[0].id, name: 'B', studentCount: 20 },
      { levelId: gradeLevels[1].id, name: 'A', studentCount: 20 },
      { levelId: gradeLevels[1].id, name: 'B', studentCount: 20 },
    ]);

    const studentClassRepository =
      queryRunner.manager.getRepository(StudentClassEntity);
    const studentClasses = this.getStudentClassesData(classes, students);
    await studentClassRepository.save(studentClasses);

    const courseRepository = queryRunner.manager.getRepository(CourseEntity);
    const courses = await courseRepository.save(this.getCoursesData());

    const teacherCourseRepository =
      queryRunner.manager.getRepository(TeacherCourseEntity);
    const teacherCourse = await teacherCourseRepository.save(
      this.getTeacherCourseData(),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}

  getTeachersData() {
    const password = PasswordUtils.createHashedPassword('123456');
    const teachers = [];
    for (let index = 0; index < 20; index++) {
      const data = {
        role: Role.TEACHER,
        firstName: 'Teacher',
        lastName: `${index + 1}`,
        email: `teacher${index + 1}@mail.com`,
        password,
      };

      teachers.push(data);
    }
    return teachers;
  }

  getStudentsData() {
    const password = PasswordUtils.createHashedPassword('123456');
    const students = [];
    for (let index = 0; index < 80; index++) {
      const data = {
        role: Role.STUDENT,
        firstName: 'Student',
        lastName: `${index + 1}`,
        email: `student${index + 1}@mail.com`,
        password,
      };
      students.push(data);
    }
    return students;
  }

  getCoursesData() {
    return [
      {
        id: 1,
        name: 'Türk Dili ve Edebiyatı',
        code: 'EDB',
        hours: 5,
        isOptional: false,
        teacherCount: 3,
      },
      {
        id: 2,
        name: 'Din Kültürü ve Ahlak Bilgisi ',
        code: 'DIN',
        hours: 2,
        isOptional: false,
        teacherCount: 1,
      },
      {
        id: 3,
        name: 'Tarih',
        code: 'TAR',
        hours: 2,
        isOptional: false,
        teacherCount: 1,
      },
      {
        id: 4,
        name: 'Coğrafya',
        code: 'CGR',
        hours: 2,
        isOptional: false,
        teacherCount: 1,
      },
      {
        id: 5,
        name: 'Matematik',
        code: 'MAT',
        hours: 6,
        isOptional: false,
        teacherCount: 3,
      },
      {
        id: 6,
        name: 'Fizik',
        code: 'FZK',
        hours: 2,
        isOptional: false,
        teacherCount: 1,
      },
      {
        id: 7,
        name: 'Kimya',
        code: 'KIM',
        hours: 2,
        isOptional: false,
        teacherCount: 1,
      },
      {
        id: 8,
        name: 'Biyoloji',
        code: 'BIY',
        hours: 2,
        isOptional: false,
        teacherCount: 1,
      },
      {
        id: 9,
        name: 'Felsefe',
        code: 'FEL',
        hours: 2,
        isOptional: false,
        teacherCount: 1,
      },
      {
        id: 10,
        name: 'İngilizce',
        code: 'ING',
        hours: 4,
        isOptional: false,
        teacherCount: 2,
      },
      {
        id: 11,
        name: 'Beden Eğitimi',
        code: 'BDN',
        hours: 2,
        isOptional: false,
        teacherCount: 1,
      },
      {
        id: 12,
        name: 'Rehberlik ve Yönlendirme',
        code: 'REH',
        hours: 1,
        isOptional: false,
        teacherCount: 1,
      },
      {
        id: 13,
        name: 'Almanca',
        code: 'ALM',
        hours: 2,
        isOptional: true,
        teacherCount: 1,
      },
      {
        id: 14,
        name: 'Psikoloji',
        code: 'PSK',
        hours: 2,
        isOptional: true,
        teacherCount: 1,
      },
      {
        id: 15,
        name: 'Bilgi ve İletişim Teknolojileri',
        code: 'BIL',
        hours: 2,
        isOptional: true,
        teacherCount: 1,
      },
    ];
  }

  getTeacherCourseData() {
    return [
      {
        courseId: 1,
        teacherId: 1,
      },
      {
        courseId: 1,
        teacherId: 2,
      },
      {
        courseId: 1,
        teacherId: 3,
      },
      {
        courseId: 5,
        teacherId: 4,
      },
      {
        courseId: 5,
        teacherId: 5,
      },
      {
        courseId: 5,
        teacherId: 6,
      },
      {
        courseId: 10,
        teacherId: 7,
      },
      {
        courseId: 10,
        teacherId: 8,
      },
      {
        courseId: 2,
        teacherId: 9,
      },
      {
        courseId: 3,
        teacherId: 10,
      },
      {
        courseId: 4,
        teacherId: 11,
      },
      {
        courseId: 6,
        teacherId: 12,
      },
      {
        courseId: 7,
        teacherId: 13,
      },
      {
        courseId: 8,
        teacherId: 14,
      },
      {
        courseId: 9,
        teacherId: 15,
      },
      {
        courseId: 11,
        teacherId: 16,
      },
      {
        courseId: 12,
        teacherId: 17,
      },
      {
        courseId: 13,
        teacherId: 18,
      },
      {
        courseId: 14,
        teacherId: 19,
      },
      {
        courseId: 15,
        teacherId: 20,
      },
    ];
  }

  getStudentClassesData(classes: ClassEntity[], students: UserEntity[]) {
    const class1Students = students.slice(0, 20).map((e) => {
      return {
        studentId: e.id,
        classId: classes[0].id,
      };
    });

    const class2Students = students.slice(20, 40).map((e) => {
      return {
        studentId: e.id,
        classId: classes[1].id,
      };
    });

    const class3Students = students.slice(40, 60).map((e) => {
      return {
        studentId: e.id,
        classId: classes[2].id,
      };
    });

    const class4Students = students.slice(60, 80).map((e) => {
      return {
        studentId: e.id,
        classId: classes[3].id,
      };
    });
    return [
      ...class1Students,
      ...class2Students,
      ...class3Students,
      ...class4Students,
    ];
  }
}
