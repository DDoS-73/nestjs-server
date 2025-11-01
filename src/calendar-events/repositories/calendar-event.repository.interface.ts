import { CalendarEventEntity } from '../../calendar-events/entities';

export interface ICalendarEventRepository {
  getAllInDateRange(from: Date, to: Date): Promise<CalendarEventEntity[]>;
  create(calendarEvent: CalendarEventEntity): Promise<CalendarEventEntity>;
  update(
    id: string,
    calendarEvent: CalendarEventEntity,
  ): Promise<CalendarEventEntity>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<CalendarEventEntity | null>;
}

export const CALENDAR_EVENT_REPOSITORY = Symbol('CALENDAR_EVENT_REPOSITORY');
