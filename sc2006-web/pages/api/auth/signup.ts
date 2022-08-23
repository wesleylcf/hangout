import axios from 'axios';
import {
	AuthUserReq,
	Response,
	SignUpRes,
} from '../../../../sc2006-common/src/api-models';

export default async function (user: AuthUserReq) {
	const { data } = await axios.post<Response<SignUpRes>>(
		`${process.env.API_URL}/auth/signup`,
		user,
	);
	const { error } = data.data;
	if (error) {
		throw new Error('There was an error signing up');
	}
}
