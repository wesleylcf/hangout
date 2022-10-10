import { PresentableError, throwErrorOrGetData } from '../lib/error';
import { GetUserRes } from '../types/api-models/user';

export class UserService {
	async getUser(email: string) {
		const response = await fetch(`${process.env.API_URL}/users/getOne`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
			}),
		});
		const data = await throwErrorOrGetData<GetUserRes>(response, {});
		return data;
	}
}
