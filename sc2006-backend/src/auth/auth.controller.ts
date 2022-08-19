import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }

  @Post('signup')
  signup(@Body() user) {
    return this.authService.signup(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
