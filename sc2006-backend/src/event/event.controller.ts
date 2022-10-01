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
import {
	EventParticipant,
	PublicEventParticipant,
} from '../../../sc2006-common/src';

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
		const { name, participants } = body;

		const manuallyAddedUsers = [];
		const authUserUuids = [];
		let creator: EventParticipant;
		participants.forEach((participant) => {
			if (participant.isCreator) {
				creator = participant;
			}
			if (participant.uuid) {
				authUserUuids.push(participant['uuid']);
			} else {
				if (!participant.isCreator) {
					manuallyAddedUsers.push(participant);
				}
			}
		});

		let authUsers = [];
		if (authUserUuids.length) {
			const users = await this.userService.bulkFindAllById(authUserUuids);
			authUsers = users;
		}

		const { eventResultId, expiresAt } =
			await this.eventResultService.createOne([
				...manuallyAddedUsers,
				...authUsers,
				creator,
			]);

		await this.eventService.createOne({
			name,
			expiresAt,
			creatorId: creator.name,
			eventResultId,
			authParticipantIds: authUserUuids,
			manualParticipants: manuallyAddedUsers,
		});
		return { error: null };
	}
}
