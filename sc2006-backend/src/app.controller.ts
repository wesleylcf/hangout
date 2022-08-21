import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*
    This endpoint should never be called. Use seed-data.sh to seed your data
  */
  @Post('seed-data')
  seedData(@Body() { secret }: { secret: string }) {
    if (secret !== process.env.SEED_DATA_SECRET) {
      throw new UnauthorizedException();
    }
    return this.appService.seedData();
  }
}
