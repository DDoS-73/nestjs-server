import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInMilliseconds,
} from 'date-fns';
import {
  CalendarEventEntity,
  EventParticipantEntity,
  RecurrenceFrequency,
} from 'src/calendar-events/entities';
import type { ICalendarEventRepository } from 'src/calendar-events/repositories';
import { CALENDAR_EVENT_REPOSITORY } from 'src/calendar-events/repositories';
import { EventParticipantDto } from '../dto';
import { DeleteMode } from '../enum/delete-mode';
import { UpdateMode } from '../enum/update-mode';
import {
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
} from './../dto/calendar-event.dto';
import { EventParticipantService } from './event-participant.service';

@Injectable()
export class CalendarEventsService {
  constructor(
    @Inject(CALENDAR_EVENT_REPOSITORY)
    private calendarEventRepository: ICalendarEventRepository,
    private eventParticipantService: EventParticipantService,
  ) {}

  public async create(
    calendarEventDto: CreateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    const participant: EventParticipantEntity =
      await this._handleParticipantInCalendarEvent(
        calendarEventDto.participant,
      );

    const entity = new CalendarEventEntity({
      ...calendarEventDto,
      participant,
      exceptions: [],
    });
    return this.calendarEventRepository.create(entity);
  }

  public async getAllInDateRange(
    from: Date,
    to: Date,
  ): Promise<CalendarEventEntity[]> {
    const potentialEvents: CalendarEventEntity[] =
      await this.calendarEventRepository.getAllInDateRange(from, to);

    return this._generateCalendarEventsInRange(potentialEvents, from, to);
  }

  public async delete(id: string, mode: DeleteMode, date: Date): Promise<void> {
    const calendarEvent: CalendarEventEntity | null =
      await this.calendarEventRepository.findById(id);
    if (!calendarEvent) {
      throw new NotFoundException(`Event with ID "${id}" not found.`);
    }

    switch (mode) {
      case DeleteMode.ALL:
        return this.calendarEventRepository.delete(id);

      case DeleteMode.SINGLE:
        calendarEvent.exceptions.push(date);
        await this.calendarEventRepository.update(id, calendarEvent);
        return;

      case DeleteMode.FUTURE:
        if (calendarEvent.startTime.getTime() === date.getTime()) {
          await this.calendarEventRepository.delete(id);
          return;
        } else {
          const newEndDate = new Date(date.getTime() - 1);
          calendarEvent.recurrence.endDate = newEndDate;
          await this.calendarEventRepository.update(id, calendarEvent);
        }
    }
  }

  public async update(
    id: string,
    mode: UpdateMode,
    date: Date,
    calendarEventDto: UpdateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    const participant: EventParticipantEntity =
      await this._handleParticipantInCalendarEvent(
        calendarEventDto.participant,
      );

    const calendarEvent: CalendarEventEntity | null =
      await this.calendarEventRepository.findById(id);
    if (!calendarEvent) {
      throw new NotFoundException(`Event with ID "${id}" not found.`);
    }

    switch (mode) {
      case UpdateMode.ALL: {
        const entity = new CalendarEventEntity({
          ...calendarEventDto,
          participant,
        });
        return await this.calendarEventRepository.update(id, entity);
      }

      case UpdateMode.SINGLE: {
        calendarEvent.exceptions.push(date);
        await this.calendarEventRepository.update(id, calendarEvent);

        const newSingleEvent = new CalendarEventEntity({
          startTime: calendarEventDto.startTime,
          endTime: calendarEventDto.endTime,
          recurrence: {
            frequency: RecurrenceFrequency.NONE,
            interval: 1,
            endDate: null,
          },
          participant,
          exceptions: [],
        });
        return this.calendarEventRepository.create(newSingleEvent);
      }

      case UpdateMode.FUTURE: {
        const newEndDate = new Date(date.getTime() - 1);
        calendarEvent.recurrence.endDate = newEndDate;
        await this.calendarEventRepository.update(id, calendarEvent);

        const newRecurringEvent = new CalendarEventEntity({
          ...calendarEventDto,
          participant,
          exceptions: [],
        });
        return this.calendarEventRepository.create(newRecurringEvent);
      }
    }
  }

  private async _handleParticipantInCalendarEvent(
    participant?: EventParticipantDto,
  ): Promise<EventParticipantEntity> {
    if (participant && !participant.id) {
      const eventParticipant = await this.eventParticipantService.create({
        name: participant.name,
      });
      return eventParticipant;
    }

    return plainToInstance(EventParticipantEntity, participant);
  }

  private _generateCalendarEventsInRange(
    potentialEvents: CalendarEventEntity[],
    from: Date,
    to: Date,
  ): CalendarEventEntity[] {
    const occurrences: CalendarEventEntity[] = [];

    for (const event of potentialEvents) {
      const duration = differenceInMilliseconds(event.endTime, event.startTime);

      if (event.recurrence.frequency === RecurrenceFrequency.NONE) {
        if (event.startTime >= from && event.startTime <= to) {
          occurrences.push(event);
        }
        continue;
      }

      let current = new Date(event.startTime);
      const recurrenceEndDate = event.recurrence.endDate
        ? new Date(event.recurrence.endDate)
        : to;

      while (current <= recurrenceEndDate && current <= to) {
        if (current >= from) {
          const isException = event.exceptions.some(
            (exDate) => exDate.getTime() === current.getTime(),
          );

          if (!isException) {
            const occurrenceStartDate = new Date(current);
            const occurrenceEndDate = new Date(
              occurrenceStartDate.getTime() + duration,
            );

            occurrences.push(
              new CalendarEventEntity({
                ...event,
                startTime: occurrenceStartDate,
                endTime: occurrenceEndDate,
              }),
            );
          }
        }

        const { frequency, interval } = event.recurrence;
        switch (frequency) {
          case RecurrenceFrequency.DAILY:
            current = addDays(current, interval);
            break;
          case RecurrenceFrequency.WEEKLY:
            current = addWeeks(current, interval);
            break;
          case RecurrenceFrequency.MONTHLY:
            current = addMonths(current, interval);
            break;
        }
      }
    }
    return occurrences;
  }
}
