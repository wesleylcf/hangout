import { PresentableError, throwErrorOrGetData } from '../lib/error';

export class UserService {
	async checkExistingUser(email: string) {
		const response = await fetch(`${process.env.API_URL}/users/check-exists`, {
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
		await throwErrorOrGetData<{
			error: Omit<PresentableError, 'name'> | null;
		}>(response, {});
	}
}
