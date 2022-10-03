import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
	DbEventResult,
	DbEventSuggestion,
	EVENT_DATETIME_FORMAT,
	EVENT_DATE_FORMAT,
	GeoapifyResponse,
	getLatLngCenter,
	PresentableError,
} from '../../../sc2006-common/src';
import fetch from 'node-fetch';
import {
	doc,
	setDoc,
	collection,
	serverTimestamp,
	Timestamp,
} from 'firebase/firestore';
import { db } from 'src/firebase.config';
import * as moment from 'moment'; // otherwise error moment is not a function

interface CreateOneResult {
	eventResultId: string;
	expiresAt: string;
}

@Injectable()
export class EventResultService {
	constructor(
		private readonly userService: UserService,
		private readonly logger: Logger,
	) {}

	async createOne(
		participants: {
			preferences: string[];
			address: string;
			schedule: Record<string, { start: string; end: string }[]>;
		}[],
	): Promise<{
		result: CreateOneResult | null;
		error: PresentableError | null;
	}> {
		try {
			// Get common preferences first since if there are none we cannot generate results.
			const commonPreferences = [];
			const candidatePreferences = new Set();
			participants.forEach((participant) => {
				const preferences = participant.preferences.length
					? participant.preferences
					: EventResultService.DEFAULT_PREFERENCES;
				preferences.forEach((preference) => {
					if (candidatePreferences.has(preference)) return;
					if (participants.every((p) => p.preferences.includes(preference))) {
						commonPreferences.push(preference);
					}
					candidatePreferences.add(preference);
				});
			});
			// Todo: Handle case when no common preference
			if (commonPreferences.length < 1) {
				return {
					result: null,
					error: {
						name: '',
						level: 'error',
						title: 'Could not generate Event results',
						message: 'Participants do not have any common preferences',
					},
				};
			}

			// Convert postal codes into latitude and longtitude
			const geoCodes = await Promise.all(
				participants.map(async ({ address }) => {
					const postal = parseInt(address);
					return await fetch(
						`https://developers.onemap.sg/commonapi/search?searchVal=${postal}&returnGeom=Y&getAddrDetails=N&pageNum=1`,
					).then((response) => response.json());
				}),
			);

			const coordinates: [lat: number, lng: number][] = geoCodes.map(
				(geoCode, index) => {
					const { LATITUDE, LONGTITUDE } = geoCode.results[0];
					if (!LATITUDE || !LONGTITUDE) {
						this.logger.warn(
							`Could not find latitude and longtitude for ${JSON.stringify(
								participants[index],
							)}`,
							'EventResultService',
						);
					}
					return [LATITUDE, LONGTITUDE];
				},
			);

			const center = getLatLngCenter(coordinates);

			const presentableCenter = `${center[1]},${center[0]}`; // Geoapify uses [lng,lat] instead of [lat, lng]
			// Since API calculates cost based on number of places returned, we use a separate call for each preference
			const places: GeoapifyResponse[] = await Promise.all(
				commonPreferences.map(async (preference) => {
					return await fetch(
						`https://api.geoapify.com/v2/places?categories=${preference}&bias=proximity:${presentableCenter}&limit=5&apiKey=${process.env.GEOAPIFY_API_KEY}`,
					).then((response) => response.json());
				}),
			);

			const suggestions: DbEventSuggestion = {};
			places.forEach((place, index) => {
				const preference = commonPreferences[index];
				suggestions[preference] = place.features.map(({ properties }) => {
					const { name, street, formatted, postcode, lat, lon, distance } =
						properties;
					return {
						name: name || street,
						address: formatted,
						postal: parseInt(postcode),
						coordinates: [lat, lon],
						distanceFromCenter: distance,
					};
				});
			});

			// calculate intersection of time ranges by getting union of busy times
			const busyDateTime = {};
			const dates = Object.keys(participants[0].schedule);
			dates.forEach((date) => {
				busyDateTime[date] = new Array(24).fill(-1);
			});
			participants.forEach(({ schedule }) => {
				const dates = Object.keys(schedule);
				dates.forEach((date) => {
					const timeRanges = schedule[date];
					timeRanges.forEach((timeRange) => {
						const { start, end } = timeRange;
						const startMoment = moment(start, EVENT_DATETIME_FORMAT);
						const endMoment = moment(end, EVENT_DATETIME_FORMAT);
						const startHour = startMoment.hours();
						const startMinutes = startMoment.minutes();
						const endHour = endMoment.hours();
						const endMinutes = endMoment.minutes();

						for (let h = startHour; h < endHour + 1; h++) {
							const minute = busyDateTime[date][h];
							if (h == startHour) {
								busyDateTime[date][h] =
									minute < 0 ? startMinutes : Math.min(minute, startMinutes);
								busyDateTime;
							} else if (h == endHour) {
								busyDateTime[date][h] =
									minute < 0 ? endMinutes : Math.max(minute, endMinutes);
							} else {
								busyDateTime[date][h] = 60;
							}
						}
					});
				});
			});

			// Initialize suggestedDates with [00:00:00, 23:59:59]
			const suggestedDates = {};
			const now = moment();
			for (let i = 1; i < 8; i++) {
				const startDateTime = moment()
					.day(now.get('day') + i)
					.startOf('day');
				const endDateTime = moment()
					.day(now.get('day') + i)
					.endOf('day');
				suggestedDates[startDateTime.format(EVENT_DATE_FORMAT)] = [
					startDateTime.format(EVENT_DATETIME_FORMAT),
					endDateTime.format(EVENT_DATETIME_FORMAT),
				];
			}
			Object.keys(busyDateTime).map((dateString) => {
				const hours = busyDateTime[dateString];
				const freeTimes = [];
				let index = 0;
				while (index < 24) {
					const start = index;
					while (index < 24 && hours[index] == -1) {
						index++;
					}

					const date = moment(dateString, EVENT_DATE_FORMAT);
					if (index > start) {
						const startDate = moment(date).hour(start).startOf('hour');
						const endDate = moment(date)
							.hour(index - 1)
							.endOf('hour');

						freeTimes.push({
							start: startDate.format(EVENT_DATETIME_FORMAT),
							end: endDate.format(EVENT_DATETIME_FORMAT),
						});
					} else {
						index++;
					}
					suggestedDates[dateString] = freeTimes;
				}
			});

			// store result and return uuid of stored result
			const result: DbEventResult = {
				suggestedDates,
				suggestions,
				createdAt: serverTimestamp() as Timestamp,
			};
			const newResultDocRef = doc(collection(db, 'event-results'));
			await setDoc(newResultDocRef, result);
			this.logger.log(
				`Successfully generated and stored event result ${newResultDocRef.id}`,
				'EventResultService',
			);

			return {
				result: {
					eventResultId: newResultDocRef.id,
					expiresAt: moment()
						.add(7, 'day')
						.endOf('day')
						.format(EVENT_DATETIME_FORMAT),
				},
				error: null,
			};
		} catch (e) {
			this.logger.error(
				`Failed to calculate places: ${e.message}
        ${e.stack}`,
				'EventResultService',
			);
		}
	}

	public static readonly DEFAULT_PREFERENCES = [
		'activities',
		'commercial',
		'catering',
		'entertainment',
		'leisure',
		'natural',
		'national_park',
		'tourism',
		'camping',
		'beach',
		'adults',
	];
}
