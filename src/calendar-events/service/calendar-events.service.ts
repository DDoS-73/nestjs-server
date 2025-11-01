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

    return this.calendarEventRepository.create({
      ...calendarEventDto,
      participant,
    });
  }

  public async getAllInDateRange(
    from: Date,
    to: Date,
  ): Promise<CalendarEventEntity[]> {
    const potentialEvents: CalendarEventEntity[] =
      await this.calendarEventRepository.getAllInDateRange(from, to);

    return this._generateCalendarEventsInRange(potentialEvents, from, to);
  }

  public delete(id: string): Promise<void> {
    return this.calendarEventRepository.delete(id);
  }

  public async update(
    id: string,
    calendarEventDto: UpdateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    const participant: EventParticipantEntity =
      await this._handleParticipantInCalendarEvent(
        calendarEventDto.participant,
      );

    const updatedEvent: CalendarEventEntity =
      await this.calendarEventRepository.update(id, {
        ...calendarEventDto,
        participant,
      });

    if (!updatedEvent) {
      throw new NotFoundException(
        `Calendar event with id ${calendarEventDto.id?.toString()} not found`,
      );
    }

    return updatedEvent;
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
          const occurrenceStartDate = new Date(current);
          const occurrenceEndDate = new Date(
            occurrenceStartDate.getTime() + duration,
          );

          occurrences.push({
            ...event,
            startTime: occurrenceStartDate,
            endTime: occurrenceEndDate,
          });
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
