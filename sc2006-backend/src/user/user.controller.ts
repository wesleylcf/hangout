import { Body, Controller, Get, Req, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CheckUserExistsDto } from './check-exists.dto';
import { PresentableError } from '../../../sc2006-common/src';

@Controller('users')
export class UserController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('/current')
	async getUserFromToken(@Req() req) {
		const jwtToken = req.cookies['jwtToken'];
		const user = await this.authService.decodeToken(jwtToken);
		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Post('check-exists')
	async checkExists(
		@Body() body: CheckUserExistsDto,
	): Promise<{ error: Omit<PresentableError, 'name'> | boolean }> {
		const { email } = body;
		const user = await this.userService.findOne(email);
		if (!user) {
			return {
				error: {
					message: 'User with specified email does not exist',
					title: 'User not found',
					level: 'warning',
				},
			};
		}
		return { error: null };
	}
}
