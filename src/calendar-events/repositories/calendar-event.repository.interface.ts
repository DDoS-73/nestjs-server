import { CalendarEventEntity } from '../../calendar-events/entities';

export interface ICalendarEventRepository {
  getAllInDateRange(
    from: Date,
    to: Date,
    userId: string,
  ): Promise<CalendarEventEntity[]>;
  create(calendarEvent: CalendarEventEntity): Promise<CalendarEventEntity>;
  update(
    id: string,
    calendarEvent: CalendarEventEntity,
    userId: string,
  ): Promise<CalendarEventEntity | null>;
  delete(id: string, userId: string): Promise<void>;
  findById(id: string, userId: string): Promise<CalendarEventEntity | null>;
}

export const CALENDAR_EVENT_REPOSITORY = Symbol('CALENDAR_EVENT_REPOSITORY');
