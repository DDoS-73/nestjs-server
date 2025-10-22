import { Controller, Get } from '@nestjs/common';
import { EventParticipantDocument } from '../schemas/event-participant.schema';
import { EventParticipantService } from '../service';

@Controller('participants')
export class EventParticipantController {
  constructor(
    private readonly eventParticipantService: EventParticipantService,
  ) {}

  @Get()
  public getAll(): Promise<EventParticipantDocument[]> {
    return this.eventParticipantService.getAll();
  }
}
