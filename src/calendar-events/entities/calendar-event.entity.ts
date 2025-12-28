import { EventParticipantEntity } from './event-participant.entity';
import { RecurrenceEntity } from './recurrence.entity';

import { Exclude } from 'class-transformer';
export class CalendarEventEntity {
  id?: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  participant: EventParticipantEntity;
  recurrence: RecurrenceEntity;

  @Exclude({ toPlainOnly: true })
  exceptions: Date[];

  constructor(calendarEvent: CalendarEventEntity) {
    Object.assign(this, calendarEvent);
  }
}
