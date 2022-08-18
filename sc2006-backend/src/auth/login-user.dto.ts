import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}
