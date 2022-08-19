import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');
import { User } from './constants';
import { AuthUserDto } from './auth-user.dto';

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

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(
    username: string,
    inputPassword: string,
  ): Promise<Omit<User, 'password'> | undefined> {
    const user = await this.userService.findOne(username);
    if (!user) {
      this.logger.warn(
        'User not found, unable to validate login',
        'AuthService',
      );
      return undefined;
    }
  }
}
