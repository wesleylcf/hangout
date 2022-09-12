import { Logger, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
	imports: [AuthModule, UserModule, JwtModule, NotificationModule],
	providers: [EventService, Logger, AuthService, UserService],
	controllers: [EventController],
})
export class EventModule {}
