import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtils } from 'src/common/utils/password.utils';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserWithToken } from '../models/user-with-token';
import { ResponseModel } from 'src/common/response/response-model';
import { notAcceptable, unauthorized } from 'src/common/response/errors';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.userService.createAdminUser();
  }

  async login(email: string, password: string): Promise<UserWithToken> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) unauthorized();
    if (!PasswordUtils.comparePassword(password, user.password)) unauthorized();

    const secret = this.config.get('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync({ user }, { secret });
    return {
      user: user,
      accessToken,
    };
  }

  async changePassword(data: ChangePasswordDto): Promise<ResponseModel> {
    if (data.newPassword !== data.newPasswordAgain)
      notAcceptable('Passwords are not same');
    const user = await this.userService.getUserById(data.userId);
    if (!user) unauthorized();
    if (!PasswordUtils.comparePassword(data.password, user.password))
      unauthorized('Wrong password');

    user.password = PasswordUtils.createHashedPassword(data.newPassword);
    await this.usersRepository.save(user);

    return {
      message: 'Password updated',
    };
  }
}
