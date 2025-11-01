import { EventParticipantEntity } from './event-participant.entity';
import { RecurrenceEntity } from './recurrence.entity';

export class CalendarEventEntity {
  id?: string;
  startTime: Date;
  endTime: Date;
  participant: EventParticipantEntity;
  recurrence: RecurrenceEntity;
  exceptions: Date[];

  constructor(calendarEvent: CalendarEventEntity) {
    Object.assign(this, calendarEvent);
  }
}
