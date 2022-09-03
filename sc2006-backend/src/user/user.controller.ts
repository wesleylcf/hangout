import { Body, Controller, Get, Req, UseGuards, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { NotificationService } from 'src/notification/notification.service';

@Controller('users')
export class UserController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(JwtAuthGuard)
	@Get('/current')
	async getUserFromToken(@Req() req) {
		const jwtToken = req.cookies['jwtToken'];
		const user = await this.authService.decodeToken(jwtToken);
		return user;
	}
}
