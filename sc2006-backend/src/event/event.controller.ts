import {
	Body,
	Controller,
	Post,
	UseInterceptors,
	UseGuards,
	Res,
	HttpStatus,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateEventDto } from './create-event.dto';
import { UserService } from 'src/user/user.service';
import { EventResultService } from 'src/event-result/event-result.service';
import { EventParticipant } from '../../../sc2006-common/src';

@UseInterceptors(LoggingInterceptor)
@Controller('events')
export class EventController {
	constructor(
		private readonly eventService: EventService,
		private readonly userService: UserService,
		private readonly eventResultService: EventResultService,
	) {}

	@Post('list')
	async getEvents(@Body() body: { uuids: string[] }) {
		const { uuids } = body;
		const events = await this.eventService.findMany(uuids);
		return events;
	}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async createEvent(
		@Body() body: CreateEventDto,
		@Res({ passthrough: true }) res,
	) {
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

		const { result, error } = await this.eventResultService.createOne([
			...manuallyAddedUsers,
			...authUsers,
			creator,
		]);

		if (error) {
			res.status(HttpStatus.BAD_REQUEST).json({ error, uuid: null });
			console.log(`Returning error: ${JSON.stringify(error)}`);
			return;
		}

		const { eventResultId, expiresAt } = result;

		const { eventUuid } = await this.eventService.createOne({
			name,
			expiresAt,
			creatorId: creator.name,
			eventResultId,
			authParticipantIds: authUserUuids,
			manualParticipants: manuallyAddedUsers,
		});
		res.status(HttpStatus.ACCEPTED).json({ error: null, eventUuid });
	}
}
