export class CalendarEventEntity {
  id: string;
  startTime: string;
  endTime: string;
  participant: string;

  constructor(calendarEvent: CalendarEventEntity) {
    Object.assign(this, calendarEvent);
  }
}
