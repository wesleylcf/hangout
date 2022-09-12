import {
	IsBoolean,
	IsNotEmpty,
	IsString,
	Length,
	MaxLength,
	MinLength,
} from 'class-validator';
import { DbEvent } from '../../../sc2006-common/src';

export class CreateEventDto
	implements Omit<DbEvent, 'createdAt' | 'creatorId' | 'eventResultIds'>
{
	@IsString()
	@Length(10, 50)
	title: string;

	@MinLength(1)
	@MaxLength(10)
	invitedParticipantIds: string[];

	@MinLength(1)
	@MaxLength(10)
	activeParticipantIds: string[];

	@IsBoolean()
	expired: boolean;
}
