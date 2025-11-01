export class EventParticipantEntity {
  id?: string;

  name: string;

  constructor(eventParticipant?: Partial<EventParticipantEntity>) {
    if (eventParticipant) {
      Object.assign(this, eventParticipant);
    }
  }
}
