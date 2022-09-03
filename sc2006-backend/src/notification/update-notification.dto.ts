import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateNotificationDto {
	@IsNotEmpty()
	notificationUuids: string[];
}
