import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './login-user.dto';

@Injectable()
export class AuthService {
  login({ email, password }: LoginUserDto): string {
    // todo call firebase auth api
    return 'Hello World!';
  }
}
