import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { JwtPayload } from 'src/auth/models';
import { EventParticipantEntity } from 'src/calendar-events/entities';
import { EventParticipantService } from '../service';

@Controller('participants')
@UseGuards(AuthGuard('jwt'))
export class EventParticipantController {
  constructor(
    private readonly eventParticipantService: EventParticipantService,
  ) {}

  @Get()
  public getAll(@Req() req: Request): Promise<EventParticipantEntity[]> {
    const user = req.user as JwtPayload;
    return this.eventParticipantService.getAll(user.id);
  }
}
