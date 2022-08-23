import {
	Controller,
	Post,
	Body,
	UseGuards,
	Get,
	Request,
	Logger,
	UseInterceptors,
	Req,
	Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './auth-user.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { LoginRes } from '../../../sc2006-common';

/* 
Interceptors are called top-down, i.e. Logging Interceptor runs before ResTransformInterCeptor
*/
@UseInterceptors(LoggingInterceptor)
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly logger: Logger,
	) {}

	/* 
    LocalAuthGuard calls ValidateUser which reads in from Body,
    And attaches onto Request, the user or error if either exists
		If you have res as a param you cannot return an object, but instead use res
  */
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@Req() req,
		@Res({ passthrough: true }) response,
	): Promise<LoginRes> {
		const { access_token, ...rest } = await this.authService.login(req.user);
		console.log('COOKIE', req.cookies['jwtToken']);
		response.cookie('jwtToken', access_token, {
			secure: process.env.NODE_ENV !== 'development',
			httpOnly: true,
			maxAge: process.env.AUTH_TOKEN_EXPIRY_MSEC,
		});
		return rest;
	}

	@Post('signup')
	signup(@Body() user: AuthUserDto) {
		return this.authService.signup(user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		console.log('COOKIE', req.cookies);
		return req.user;
	}
}
