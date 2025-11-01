import {
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
} from 'src/calendar-events/dto';
import { CalendarEventEntity } from '../../calendar-events/entities';

export interface ICalendarEventRepository {
  getAllInDateRange(from: Date, to: Date): Promise<CalendarEventEntity[]>;
  create(calendarEvent: CreateCalendarEventDto): Promise<CalendarEventEntity>;
  update(
    id: string,
    calendarEvent: UpdateCalendarEventDto,
  ): Promise<CalendarEventEntity>;
  delete(id: string): Promise<void>;
}

export const CALENDAR_EVENT_REPOSITORY = Symbol('CALENDAR_EVENT_REPOSITORY');
