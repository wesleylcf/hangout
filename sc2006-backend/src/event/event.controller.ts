/*eslint-disable no-mixed-spaces-and-tabs */
import {
	Body,
	Controller,
	Post,
	UseInterceptors,
	UseGuards,
	Res,
	HttpStatus,
	Param,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateEventDto } from './create-event.dto';
import { EventResultService } from 'src/event-result/event-result.service';
import {
	DetailedEventRes,
	EVENT_DATETIME_FORMAT,
	ListBriefEventRes,
	EVENT_DATE_FORMAT,
	EventFilterType,
} from '../../../sc2006-common/src';
import { UpdateEventDto } from './update-event.dto';
import * as moment from 'moment';
import { ListEventsDto } from './list-events.dto';
import { UserService } from 'src/user/user.service';
import { Moment } from 'moment';

@UseInterceptors(LoggingInterceptor)
@Controller('events')
export class EventController {
	constructor(
		private readonly eventService: EventService,
		private readonly eventResultService: EventResultService,
		private readonly userService: UserService,
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
	async getFilteredEvents(@Body() body: ListEventsDto) {
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

	@Post('brief/list/:filter')
	async getEvents(
		@Body() body: ListEventsDto,
		@Param() params: { filter: EventFilterType },
	): Promise<ListBriefEventRes> {
		console.log('filtering');
		const { eventUuids, userUuid } = body;
		const events = await this.eventService.findMany(eventUuids);
		const now = moment();

		const filterFunction = params.filter
			? (function (filter: EventFilterType) {
					switch (filter) {
						case 'month':
							return function (mmt: Moment) {
								const lowerBound = moment().subtract(31, 'days').startOf('day');
								const upperBound = moment().add(7, 'days').endOf('day');
								return mmt.isBetween(lowerBound, upperBound, undefined, '[]');
							};
					}
			  })(params.filter)
			: null;

		const activeEvents = events.filter((e) => {
			const expiry = moment(e.expiresAt, EVENT_DATETIME_FORMAT);
			return (
				now.isSameOrBefore(expiry) &&
				(filterFunction ? filterFunction(expiry) : true)
			);
		});
		const activeAndCreatedEvents = [];
		const activeAndParticipantEvent = [];
		activeEvents.forEach((event) => {
			if (event.creatorId === userUuid) activeAndCreatedEvents.push(event);
			else activeAndParticipantEvent.push(event);
		});

		const expiredEvents = events.filter((e) => {
			const expiry = moment(e.expiresAt, EVENT_DATETIME_FORMAT);
			return (
				now.isAfter(expiry) && (filterFunction ? filterFunction(expiry) : true)
			);
		});
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

		const { eventResultId, expiresAt, proposedDate, suggestedDates } = result;

		const { eventUuid } = await this.eventService.createOne({
			name,
			expiresAt,
			creatorId: creator.name,
			eventResultId,
			participants,
			proposedDate,
		});

		const authUserUuids = [];
		const authUsers = [];
		participants.map((p) => {
			if ('uuid' in p) {
				authUserUuids.push(p.uuid);
				authUsers.push({
					schedule: {
						[proposedDate]: [
							{
								start: moment(proposedDate, EVENT_DATE_FORMAT)
									.startOf('day')
									.format(EVENT_DATETIME_FORMAT),
								end: moment(proposedDate, EVENT_DATE_FORMAT)
									.endOf('day')
									.format(EVENT_DATETIME_FORMAT),
							},
						],
					},
				});
			}
		});

		await this.userService.bulkUpdate({
			uuids: authUserUuids,
			users: authUsers,
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
		@Res({ passthrough: true }) res,
	) {
		const { participants } = body;

		const { result, error } = await this.eventResultService.createOne(
			participants,
			true,
		);

		if (error) return { error };

		const { eventResultId } = result;
		return {
			...result,
			createdAt: moment().format(EVENT_DATETIME_FORMAT), //Since Timestamp is not actually created until it reaches FireStore
			uuid: eventResultId,
		};
	}
}
