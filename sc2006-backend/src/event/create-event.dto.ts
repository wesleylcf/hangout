import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsString,
	Length,
	Matches,
	ValidateIf,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEventReq, EventParticipant } from '../../../sc2006-common/src';
import { Regex } from '../../../sc2006-common/src';

export class CreateEventDto implements CreateEventReq {
	@IsString()
	@Length(10, 50)
	name: string;

	@IsArray()
	@ArrayMinSize(2)
	@ValidateNested({ each: true })
	@Type(() => ParticipantDto)
	participants: Array<EventParticipant>;
}

export class ParticipantDto {
	@ValidateIf((o) => typeof o.name === 'undefined')
	@IsString()
	uuid?: string;

	@IsBoolean()
	isCreator: boolean;

	@ValidateIf((o) => typeof o.uuid === 'undefined')
	@IsString()
	name: string;

	@ValidateIf((o) => typeof o.uuid === 'undefined')
	@IsArray()
	@IsString({ each: true })
	preferences: Array<string>;

	@ValidateIf((o) => typeof o.uuid === 'undefined')
	schedule: Record<string, [string, string][]>;

	@ValidateIf((o) => typeof o.uuid === 'undefined')
	@IsString()
	@Matches(Regex.POSTAL_CODE)
	address: string;
}
