import {
	Body,
	Controller,
	Post,
	UseInterceptors,
	UseGuards,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateEventDto } from './create-event.dto';
import { UserService } from 'src/user/user.service';
import { EventResultService } from 'src/event-result/event-result.service';
import { PublicEventParticipant } from '../../../sc2006-common/src';

@UseInterceptors(LoggingInterceptor)
@Controller('events')
export class EventController {
	constructor(
		private readonly eventService: EventService,
		private readonly userService: UserService,
		private readonly eventResultService: EventResultService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async createEvent(@Body() body: CreateEventDto) {
		const { participants } = body;

		const manuallyAddedUsers = [];
		const userUuids = [];
		participants.forEach((participant) => {
			if (participant['uuid']) {
				userUuids.push(participant['uuid']);
			} else {
				manuallyAddedUsers.push(participant);
			}
		});
		let authUsers = [];
		if (userUuids.length) {
			const users = await this.userService.bulkFindAllById(userUuids);
			authUsers = users as any[];
		}

		const populatedParticipants: PublicEventParticipant[] =
			manuallyAddedUsers.concat(authUsers);

		const eventResultId = await this.eventResultService.createOne(
			populatedParticipants,
		);
		// await this.eventService.createOne(body, user.uuid);
	}
}
