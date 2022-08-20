import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './auth-user.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { ResTransformInterceptor } from 'src/ResTransform.interceptor';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { User } from './constants';

/* 
Interceptors are called top-down, i.e. Logging Interceptor runs before ResTransformInterCeptor
*/
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(ResTransformInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() user: User) {
    return this.authService.login(user);
  }

  @Post('signup')
  signup(@Body() user: AuthUserDto) {
    return this.authService.signup(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
