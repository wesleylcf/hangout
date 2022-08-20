import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('seed-data')
  getHello(@Body() { secret }: { secret: string }) {
    if (secret !== process.env.SEED_DATA_SECRET) {
      throw new UnauthorizedException();
    }
    return this.appService.seedData();
  }
}
