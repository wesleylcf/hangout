import { SignUpRes, LoginRes, AuthUserReq } from '../types';

export class MeService {
	async signup(user: AuthUserReq) {
		const response = await fetch(`${process.env.API_URL}/auth/signup`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		});
		const data: SignUpRes = await response.json();
		const { error } = data;
		if (error) {
			throw new Error('There was an error signing up');
		}
	}

	async login(req: AuthUserReq) {
		const response = await fetch(`${process.env.API_URL}/auth/login`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		const data: LoginRes = await response.json();
		const { user, error } = data;
		if (error) {
			throw new Error(error);
		}
		return user!;
	}

	async revalidate() {
		const response = await fetch(`${process.env.API_URL}/auth/revalidate`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
		});
		return response;
	}
}
