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

  public getAll(userId: string): Promise<EventParticipantEntity[]> {
    return this.eventParticipantRepository.getAll(userId);
  }

  public getByName(
    name: string,
    userId: string,
  ): Promise<EventParticipantEntity | null> {
    return this.eventParticipantRepository.getByName(name, userId);
  }

  public create(
    eventParticipant: CreateEventParticipantDto,
    userId: string,
  ): Promise<EventParticipantEntity> {
    const entity = new EventParticipantEntity({
      ...eventParticipant,
      userId,
    });
    return this.eventParticipantRepository.create(entity);
  }
}
