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
import { ResTransformInterceptor } from 'src/ResTransform.interceptor';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { ValidateUserOutcome } from 'src/constants';

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

	/* 
    LocalAuthGuard calls ValidateUser which reads in from Body,
    And attaches onto Request, the user or error if either exists
		If you have res as a param you cannot return an object, but instead use res
  */
	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(
		@Req() req: { user: ValidateUserOutcome },
		@Res({ passthrough: true }) res,
	) {
		const { user, error } = req.user;
		this.logger.log(error, 'err');
		if (error) {
			return error;
		}
		return user;
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
