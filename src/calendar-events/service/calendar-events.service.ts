import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  CalendarEventEntity,
  EventParticipantEntity,
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

  public getAllInDateRange(
    from: string,
    to: string,
  ): Promise<CalendarEventEntity[]> {
    return this.calendarEventRepository.getAllInDateRange(from, to);
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
}
