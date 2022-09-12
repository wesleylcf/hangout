import {
	Body,
	Controller,
	Post,
	UseInterceptors,
	UseGuards,
	Req,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { AuthService } from 'src/auth/auth.service';
import { CreateEventDto } from './create-event.dto';

@UseInterceptors(LoggingInterceptor)
@Controller('events')
export class EventController {
	constructor(
		private readonly eventService: EventService,
		private readonly authService: AuthService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async createEvent(@Req() req, @Body() body: CreateEventDto) {
		const { user } = await this.authService.decodeToken(req.user);
		console.log('UUID', user.uuid);
		await this.eventService.createOne(body, user.uuid);
	}
}
