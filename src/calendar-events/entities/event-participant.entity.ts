import { Transform } from 'class-transformer';

export class EventParticipantEntity {
  @Transform(
    ({ obj }: { obj: { _id?: { toString(): string }; id?: string } }) =>
      obj._id?.toString() || obj.id,
    { toClassOnly: true },
  )
  id: string;

  name: string;

  constructor(eventParticipant?: Partial<EventParticipantEntity>) {
    if (eventParticipant) {
      Object.assign(this, eventParticipant);
    }
  }
}
