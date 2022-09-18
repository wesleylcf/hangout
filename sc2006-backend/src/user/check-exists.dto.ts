import { IsEmail } from 'class-validator';

export class CheckUserExistsDto {
	@IsEmail()
	email: string;
}
