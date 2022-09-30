import { EventService } from './EventService';
import { MeService } from './MeService';
import { NotificationService } from './NotificationService';
import { UserService } from './UserService';

export const meService = new MeService();
export const notificationService = new NotificationService();
export const userService = new UserService();
export const eventService = new EventService();
