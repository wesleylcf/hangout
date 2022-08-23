import axios from 'axios';
import {
	SignUpRes,
	LoginRes,
	AuthUserReq,
} from '../../sc2006-common/src/api-models';

export class MeService {
	async signup(user: AuthUserReq) {
		const { data } = await axios.post<SignUpRes>(
			`${process.env.API_URL}/auth/signup`,
			user,
		);
		const { error } = data;
		if (error) {
			throw new Error('There was an error signing up');
		}
	}

	async login(req: AuthUserReq) {
		const res = await axios.post<LoginRes>(
			`${process.env.API_URL}/auth/login`,
			req,
		);
		console.log(res);
		const { data, headers } = res;
		console.log(data, headers);
		const { user, error } = data;
		if (error) {
			throw new Error(error);
		}

		// set token
		return user!;
	}
}
