import { Controller } from '@nestjs/common';
import { EventResultService } from './event-result.service';

@Controller('event-result')
export class EventResultController {
	constructor(private readonly eventResultService: EventResultService) {}
}
