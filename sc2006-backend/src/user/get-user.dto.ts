import { IsEmail } from 'class-validator';

export class GetUserDto {
	@IsEmail()
	email: string;
}
