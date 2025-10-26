import { Controller, Get } from '@nestjs/common';
import { EventParticipantEntity } from 'src/calendar-events/entities';
import { EventParticipantService } from '../service';

@Controller('participants')
export class EventParticipantController {
  constructor(
    private readonly eventParticipantService: EventParticipantService,
  ) {}

  @Get()
  public getAll(): Promise<EventParticipantEntity[]> {
    return this.eventParticipantService.getAll();
  }
}
