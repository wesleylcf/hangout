import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SeedDataService } from './seed-data/seed-data.service';
import { SeedDataModule } from './seed-data/seed-data.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, SeedDataModule],
  controllers: [AppController, AuthController],
  providers: [AppService, Logger, SeedDataService],
})
export class AppModule {}
