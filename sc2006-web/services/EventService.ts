import { throwErrorOrGetData } from '../lib/error';
import { CreateEventReq, CreateEventRes } from '../types';

export class EventService {
	async create(req: CreateEventReq) {
		const response = await fetch(`${process.env.API_URL}/events/create`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		const data = await throwErrorOrGetData<CreateEventRes>(response, {
			fallbackMessage:
				'Please check your inputs. Otherwise please try again later or send us an alert',
			fallbackTitle: 'Failed to create event',
		});
		return data;
	}
}
