import {
	Controller,
	Post,
	Get,
	Body,
	UnauthorizedException,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards';

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
