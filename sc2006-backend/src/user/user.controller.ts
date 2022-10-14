import { Body, Controller, Get, Req, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUserDto } from './get-user.dto';
import { GetUserRes, PresentableError } from '../../../sc2006-common/src';
import { UpdateUserDto } from './update-user.dto';

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
	@Post('getOne')
	async getOne(@Body() body: GetUserDto): Promise<GetUserRes> {
		const { email } = body;
		const user = await this.userService.findOne(email);
		if (!user) {
			const presentableError: Omit<PresentableError, 'name'> = {
				message: 'User with specified email does not exist',
				title: 'User not found',
				level: 'warning',
			};
			return {
				error: presentableError,
				user: null,
			};
		}
		return { error: null, user };
	}

	@UseGuards(JwtAuthGuard)
	@Post('updateOne')
	async updateOne(
		@Body() body: UpdateUserDto,
	): Promise<{ error: null | Omit<PresentableError, 'name'> }> {
		const { uuid, user } = body;
		const error = await this.userService.updateOne(uuid, user);
		return { error };
	}
}
