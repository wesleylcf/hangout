import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsOptional,
	IsString,
	Length,
	Matches,
	ValidateIf,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
	CreateEventReq,
	DbUserRes,
	EventParticipant,
	UpdateUserReq,
} from '../../../sc2006-common/src';
import { Regex } from '../../../sc2006-common/src';

export class UpdateUserDto implements UpdateUserReq {
	@IsString()
	uuid: string;

	@ValidateNested()
	@Type(() => UserDto)
	user: DbUserRes;
}

export class UserDto
	implements Pick<DbUserRes, 'address' | 'preferences' | 'schedule'>
{
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	preferences: Array<string>;

	@IsOptional()
	schedule: Record<string, { start: string; end: string }[]>;

	@IsOptional()
	@IsString()
	@Matches(Regex.POSTAL_CODE)
	address: string;
}
