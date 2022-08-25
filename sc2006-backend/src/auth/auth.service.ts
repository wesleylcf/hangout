import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt'); // eslint-disable-line
import { AuthUserDto } from './auth-user.dto';
import { ValidateUserOutcome, TokenInput } from '../constants/auth';
import { Timestamp } from 'firebase/firestore';

@Injectable()
export class AuthService {
	private readonly saltRounds = 10;
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private logger: Logger,
	) {}

	async signup({ username, password }: AuthUserDto) {
		const storedUser = await this.userService.findOne(username);
		if (storedUser) {
			return { error: 'Unable to sign up user: User already exists' };
		}
		try {
			const hashedPassword = await bcrypt.hash(password, this.saltRounds);
			await this.userService.create({
				username: username,
				password: hashedPassword,
			});
			return { error: null };
		} catch (e) {
			return { error: e.message };
		}
	}

	async signToken(
		outcome: ValidateUserOutcome,
	): Promise<ValidateUserOutcome & { access_token: string | null }> {
		const { user, error } = outcome;
		const tokenInput: TokenInput = {
			username: user.username,
			createdAt: user.createdAt,
		};
		let access_token = null;
		if (!error) {
			access_token = this.jwtService.sign(tokenInput);
		}
		return { ...outcome, access_token };
	}

	async decodeToken(token: string) {
		const decoded = this.jwtService.decode(token) as TokenInput;
		const { username } = decoded;
		const user = await this.userService.findOne(username);
		if (!user) {
			this.logger.log(
				'User could not be found from decoded token',
				'AuthService',
			);
		}
		const { password, ...rest } = user;

		return { user: rest };
	}

	async validateUser(
		username: string,
		inputPassword: string,
	): Promise<ValidateUserOutcome> {
		try {
			const user = await this.userService.findOne(username);
			if (!user) {
				throw new Error(`User ${username} not found`);
			}
			const response: boolean = await bcrypt.compare(
				inputPassword,
				user.password,
			);
			if (!response) {
				throw new Error('Invalid password');
			}
			const { password, ...rest } = user;

			return { user: rest };
		} catch (e) {
			this.logger.warn(`User validation failed: ${e.message}`, 'AuthService');
			return { error: e.message };
		}
	}

	/* 
    Promise.all takes iterable of promises, and returns a single promise.
  */
	async hashPasswords(users: { password: string }[]): Promise<string[]> {
		return Promise.all(
			users.map(async (user) => {
				return await bcrypt.hash(user.password, 10);
			}),
		);
	}
}
