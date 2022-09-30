import { PresentableError, throwErrorOrGetData } from '../lib/error';
import { CreateEventReq } from '../types';

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
		console.log(response);
	}
}
