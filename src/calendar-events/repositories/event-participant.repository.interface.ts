import { EventParticipantEntity } from '../../calendar-events/entities';

export interface IEventParticipantRepository {
  getAll(userId: string): Promise<EventParticipantEntity[]>;
  getByName(
    name: string,
    userId: string,
  ): Promise<EventParticipantEntity | null>;
  create(
    eventParticipant: EventParticipantEntity,
  ): Promise<EventParticipantEntity>;
}

export const EVENT_PARTICIPANT_REPOSITORY = Symbol(
  'EVENT_PARTICIPANT_REPOSITORY',
);
