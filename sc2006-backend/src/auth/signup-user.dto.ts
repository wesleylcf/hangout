import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
