import { CreateEventParticipantDto } from 'src/calendar-events/dto';
import { EventParticipantEntity } from '../../calendar-events/entities';

export interface IEventParticipantRepository {
  getAll(): Promise<EventParticipantEntity[]>;
  getByName(name: string): Promise<EventParticipantEntity | null>;
  create(
    eventParticipant: CreateEventParticipantDto,
  ): Promise<EventParticipantEntity>;
}

export const EVENT_PARTICIPANT_REPOSITORY = Symbol(
  'EVENT_PARTICIPANT_REPOSITORY',
);
