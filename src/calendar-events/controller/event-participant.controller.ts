import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventParticipantEntity } from 'src/calendar-events/entities';
import { EventParticipantService } from '../service';

@Controller('participants')
@UseGuards(AuthGuard('jwt'))
export class EventParticipantController {
  constructor(
    private readonly eventParticipantService: EventParticipantService,
  ) {}

  @Get()
  public getAll(): Promise<EventParticipantEntity[]> {
    return this.eventParticipantService.getAll();
  }
}
