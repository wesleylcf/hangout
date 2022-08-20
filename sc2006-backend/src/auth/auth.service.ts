import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');
import { User } from './constants';
import { AuthUserDto } from './auth-user.dto';
import { ValidateUserOutcome } from './constants';

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

  async login(user: ValidateUserOutcome) {
    return user['error']
      ? { error: 'Invalid username or password' }
      : {
          access_token: this.jwtService.sign(user),
        };
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

      return user;
    } catch (e) {
      this.logger.warn(`User validation failed: ${e.message}`, 'AuthService');
      return { error: e.message };
    }
  }
}
