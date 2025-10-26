import { Inject, Injectable } from '@nestjs/common';
import { EventParticipantEntity } from 'src/calendar-events/entities';
import { CreateEventParticipantDto } from '../dto';
import type { IEventParticipantRepository } from '../repositories';
import { EVENT_PARTICIPANT_REPOSITORY } from '../repositories';

@Injectable()
export class EventParticipantService {
  constructor(
    @Inject(EVENT_PARTICIPANT_REPOSITORY)
    private eventParticipantRepository: IEventParticipantRepository,
  ) {}

  public getAll(): Promise<EventParticipantEntity[]> {
    return this.eventParticipantRepository.getAll();
  }

  public getByName(name: string): Promise<EventParticipantEntity | null> {
    return this.eventParticipantRepository.getByName(name);
  }

  public create(
    eventParticipant: CreateEventParticipantDto,
  ): Promise<EventParticipantEntity> {
    return this.eventParticipantRepository.create(eventParticipant);
  }
}
