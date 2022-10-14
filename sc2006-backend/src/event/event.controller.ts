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
import { EventResultService } from 'src/event-result/event-result.service';
import {
	DetailedEventRes,
	DbEventResultRes,
	EVENT_DATETIME_FORMAT,
	ListBriefEventRes,
	PresentableError,
} from '../../../sc2006-common/src';
import { UpdateEventDto } from './update-event.dto';
import * as moment from 'moment';
import { ListEventsDto } from './list-events.dto';

@UseInterceptors(LoggingInterceptor)
@Controller('events')
export class EventController {
	constructor(
		private readonly eventService: EventService,
		private readonly eventResultService: EventResultService,
	) {}

	@Post('detailed/one')
	async getEvent(@Body() body: { uuid: string }): Promise<DetailedEventRes> {
		const { uuid } = body;
		const event = await this.eventService.findOne(uuid);
		const { eventResultId, ...rest } = event;
		const eventResult = await this.eventResultService.findOne(eventResultId);
		return {
			...rest,
			eventResult,
		};
	}

	@Post('brief/list')
	async getEvents(@Body() body: ListEventsDto): Promise<ListBriefEventRes> {
		const { eventUuids, userUuid } = body;
		const events = await this.eventService.findMany(eventUuids);
		const now = moment();
		const activeEvents = events.filter((e) =>
			now.isSameOrBefore(moment(e.expiresAt, EVENT_DATETIME_FORMAT)),
		);
		const activeAndCreatedEvents = [];
		const activeAndParticipantEvent = [];
		activeEvents.forEach((event) => {
			if (event.creatorId === userUuid) activeAndCreatedEvents.push(event);
			else activeAndParticipantEvent.push(event);
		});
		const expiredEvents = events.filter((e) =>
			now.isAfter(moment(e.expiresAt, EVENT_DATETIME_FORMAT)),
		);
		const expiredAndCreatedEvents = [];
		const expiredAndParticipantEvent = [];
		expiredEvents.forEach((event) => {
			if (event.creatorId === userUuid) expiredAndCreatedEvents.push(event);
			else expiredAndParticipantEvent.push(event);
		});
		return {
			active: {
				creator: activeAndCreatedEvents,
				participant: activeAndParticipantEvent,
			},
			expired: {
				creator: expiredAndCreatedEvents,
				participant: expiredAndParticipantEvent,
			},
		};
	}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async createEvent(
		@Body() body: CreateEventDto,
		@Res({ passthrough: true }) res,
	) {
		const { name, participants } = body;

		const creator = participants.find((p) => p.isCreator);

		const { result, error } = await this.eventResultService.createOne(
			participants,
		);

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
			participants,
		});

		res.status(HttpStatus.ACCEPTED).json({ error: null, eventUuid });
	}

	@UseGuards(JwtAuthGuard)
	@Post('update')
	async updateEvent(@Body() body: UpdateEventDto) {
		const { newEvent, uuid, eventResultId } = body;
		const { name, participants } = newEvent;

		const { error } = await this.eventResultService.updateOne({
			uuid: eventResultId,
			participants: newEvent.participants,
		});
		if (error) {
			return { error };
		}

		await this.eventService.updateOne({
			uuid,
			name,
			participants,
		});
		return { error };
	}

	@Post('demo/create')
	async createDemoEvent(
		@Body() body: CreateEventDto,
	): Promise<DbEventResultRes | Omit<PresentableError, 'name'>> {
		const { participants } = body;

		const { result, error } = await this.eventResultService.createOne(
			participants,
			true,
		);
		if (error) return error;
		const { eventResultId } = result;
		return {
			...result,
			createdAt: moment().format(EVENT_DATETIME_FORMAT), //Since Timestamp is not actually created until it reaches FireStore
			uuid: eventResultId,
		};
	}
}
