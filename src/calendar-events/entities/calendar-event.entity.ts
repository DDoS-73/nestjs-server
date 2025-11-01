import { RecurrenceEntity } from './recurrence.entity';

export class CalendarEventEntity {
  id: string;
  startTime: Date;
  endTime: Date;
  participant: string;
  recurrence: RecurrenceEntity;

  constructor(calendarEvent: CalendarEventEntity) {
    Object.assign(this, calendarEvent);
  }
}
