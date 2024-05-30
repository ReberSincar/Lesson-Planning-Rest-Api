import { Body, Controller, Post, Put, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  badRequestErrorSchema,
  unauhorizedErrorSchema,
  notAcceptableErrorSchema,
  internalServerErrorSchema,
} from 'src/common/doc-models/error-schemas';
import { UserWithToken } from '../models/user-with-token';
import { ResponseModel } from 'src/common/response/response-model';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with credentials.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: UserWithToken })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  signIn(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Put('password')
  @ApiOperation({ summary: 'Change user password.' })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: ResponseModel })
  @ApiResponse(badRequestErrorSchema)
  @ApiResponse(unauhorizedErrorSchema)
  @ApiResponse(notAcceptableErrorSchema)
  @ApiResponse(internalServerErrorSchema)
  changePassword(@Body() body: ChangePasswordDto, @Request() req: any) {
    body.userId = req.user.id;
    return this.authService.changePassword(body);
  }
}
