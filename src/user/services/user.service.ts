import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from 'src/user/enums/role.enum';
import { PasswordUtils } from 'src/common/utils/password.utils';
import { notAcceptable, notFound } from 'src/common/response/errors';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto } from 'src/common/pagination/page-meta.dto';
import { GetUsersQueryDto } from '../dto/get-users-query.dto';
import { StudentClassEntity } from 'src/class/entities/student-class.entity';
import { ResponseModel } from 'src/common/response/response-model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getUsers(query: GetUsersQueryDto) {
    const userResult = await this.usersRepository.findAndCount({
      where: query.role
        ? {
            role: query.role,
          }
        : undefined,
      skip: query.skip,
      take: query.take,
      order: {
        ['createdAt']: query.order,
      },
    });

    const meta = new PageMetaDto({
      itemCount: userResult[1],
      pageOptionsDto: query,
    });
    return new PageDto(
      userResult[0].map((e) => e.toModel()),
      meta,
    );
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) notFound('User not found');
    return user;
  }

  async getUsersList(list: number[]): Promise<UserEntity[]> {
    return this.usersRepository.findBy({ id: In(list) });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async checkEmail(
    email: string,
    em?: EntityManager,
  ): Promise<UserEntity | null> {
    em = em ?? this.usersRepository.manager;
    return em.findOne(UserEntity, {
      where: { email },
    });
  }

  async createUser(
    createUserDto: CreateUserDto,
    em?: EntityManager,
  ): Promise<UserEntity> {
    em = em ?? this.usersRepository.manager;
    const checkEmail = await this.checkEmail(createUserDto.email, em);
    if (checkEmail) notAcceptable('Email already using');

    const password = await PasswordUtils.createHashedPassword(
      createUserDto.password,
    );
    const user = await em.save(UserEntity, {
      ...createUserDto,
      password,
    });
    return this.getUserById(user.id);
  }

  async createAdminUser() {
    const admin = await this.usersRepository.findOne({
      where: {
        role: Role.ADMIN,
        email: process.env.ADMIN_EMAIL,
      },
    });

    if (admin) return;

    const entity = new UserEntity();
    entity.role = Role.ADMIN;
    entity.firstName = 'ADMIN';
    entity.lastName = 'ADMIN';
    entity.email = process.env.ADMIN_EMAIL.toLocaleLowerCase();
    entity.password = PasswordUtils.createHashedPassword(
      process.env.ADMIN_PASSWORD,
    );

    await this.usersRepository.save(entity);
  }
}
