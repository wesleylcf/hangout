import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SeedDataService } from './seed-data/seed-data.service';
import { SeedDataModule } from './seed-data/seed-data.module';
import * as Joi from 'joi';
import { UserController } from './user/user.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';

/*
  Joi used to define an Object Schema which is compared to Config Object,
  So if for example NODE_ENV which we marked as required is not defined, an error is thrown
*/
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision')
					.required(),
				PORT: Joi.number().required(),
				JWT_SECRET: Joi.string().required(),
				AUTH_TOKEN_EXPIRY_MSEC: Joi.number().required(),
			}),
		}),
		AuthModule,
		UserModule,
		SeedDataModule,
		NotificationModule,
	],
	controllers: [AppController, AuthController, UserController],
	providers: [AppService, Logger, SeedDataService, NotificationService],
})
export class AppModule {}
