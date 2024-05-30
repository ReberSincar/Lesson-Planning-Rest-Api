import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1716988676623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."Role" AS ENUM('ADMIN', 'TEACHER', 'STUDENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "role" "public"."Role" NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "course" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "teacherCount" integer NOT NULL DEFAULT '0', "hours" integer NOT NULL, "isOptional" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5cf4963ae12285cda6432d5a3a4" UNIQUE ("code"), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "teacher_course" ("id" SERIAL NOT NULL, "teacherId" integer NOT NULL, "courseId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_92ca6d3e3a31f7673a9c4b3455" UNIQUE ("teacherId"), CONSTRAINT "PK_7caa8c0353ceb7d792d058a25e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "student_class" ("id" SERIAL NOT NULL, "studentId" integer NOT NULL, "classId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_54d9dc074a5b2c5a75514e2223" UNIQUE ("studentId"), CONSTRAINT "PK_85874ee23f2927b59ff5f769f3c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "grade_level" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3119ab460a933da425050447252" UNIQUE ("name"), CONSTRAINT "PK_671ed744b09956194024b8b7645" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "class" ("id" SERIAL NOT NULL, "levelId" integer NOT NULL, "name" character varying NOT NULL, "studentCount" integer NOT NULL DEFAULT '0', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6ebf6700ea6d620e6f113f967" ON "class" ("levelId", "name") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."Workday" AS ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "lesson" ("id" SERIAL NOT NULL, "teacherCourseId" integer NOT NULL, "classId" integer NOT NULL, "day" "public"."Workday" NOT NULL, "lessonNumber" integer NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "teacher_course" ADD CONSTRAINT "FK_92ca6d3e3a31f7673a9c4b34556" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teacher_course" ADD CONSTRAINT "FK_526a1fe0393c3181a34af63358f" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_class" ADD CONSTRAINT "FK_54d9dc074a5b2c5a75514e2223f" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_class" ADD CONSTRAINT "FK_509d644c30e7b1d6dd4aa35c384" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" ADD CONSTRAINT "FK_00337a1dbb836d011dccbd5409d" FOREIGN KEY ("levelId") REFERENCES "grade_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_32bdc1173e1f94b11dfc4d98f0e" FOREIGN KEY ("teacherCourseId") REFERENCES "teacher_course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_f327c28c988cbfe23a725982727" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_f327c28c988cbfe23a725982727"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_32bdc1173e1f94b11dfc4d98f0e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" DROP CONSTRAINT "FK_00337a1dbb836d011dccbd5409d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_class" DROP CONSTRAINT "FK_509d644c30e7b1d6dd4aa35c384"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_class" DROP CONSTRAINT "FK_54d9dc074a5b2c5a75514e2223f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teacher_course" DROP CONSTRAINT "FK_526a1fe0393c3181a34af63358f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teacher_course" DROP CONSTRAINT "FK_92ca6d3e3a31f7673a9c4b34556"`,
    );
    await queryRunner.query(`DROP TABLE "lesson"`);
    await queryRunner.query(`DROP TYPE "public"."Workday"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e6ebf6700ea6d620e6f113f967"`,
    );
    await queryRunner.query(`DROP TABLE "class"`);
    await queryRunner.query(`DROP TABLE "grade_level"`);
    await queryRunner.query(`DROP TABLE "student_class"`);
    await queryRunner.query(`DROP TABLE "teacher_course"`);
    await queryRunner.query(`DROP TABLE "course"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."Role"`);
  }
}
