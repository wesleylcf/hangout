import axios from 'axios';
import {
	SignUpRes,
	LoginRes,
	AuthUserReq,
	Response,
} from '../../sc2006-common/src/api-models';

export class MeService {
	async signup(user: AuthUserReq) {
		const { data } = await axios.post<Response<SignUpRes>>(
			`${process.env.API_URL}/auth/signup`,
			user,
		);
		const { error } = data.data;
		if (error) {
			throw new Error('There was an error signing up');
		}
	}

	async login(req: AuthUserReq) {
		const { data } = await axios.post<Response<LoginRes>>(
			`${process.env.API_URL}/auth/login`,
			req,
		);
		console.log(data);
		const { user, access_token, error } = data.data;
		if (error) {
			throw new Error(error);
		}

		// set token
		return user!;
	}
}
