import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CalendarEvent,
  CalendarEventSchema,
} from 'src/calendar-events/infrastructure/mongo/schemas';
import {
  EventParticipant,
  EventParticipantSchema,
} from 'src/calendar-events/infrastructure/mongo/schemas/event-participant.schema';
import {
  CALENDAR_EVENT_REPOSITORY,
  EVENT_PARTICIPANT_REPOSITORY,
} from 'src/calendar-events/repositories';
import { CalendarEventRepositoryMongo } from './calendar-event.repository.mongo';
import { EventParticipantRepositoryMongo } from './event-participant.repository.mongo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CalendarEvent.name, schema: CalendarEventSchema },
      { name: EventParticipant.name, schema: EventParticipantSchema },
    ]),
  ],
  providers: [
    {
      provide: CALENDAR_EVENT_REPOSITORY,
      useClass: CalendarEventRepositoryMongo,
    },
    {
      provide: EVENT_PARTICIPANT_REPOSITORY,
      useClass: EventParticipantRepositoryMongo,
    },
  ],
  exports: [CALENDAR_EVENT_REPOSITORY, EVENT_PARTICIPANT_REPOSITORY],
})
export class MongoModule {}
