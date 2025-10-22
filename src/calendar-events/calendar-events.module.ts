import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarEventsController } from './controller';
import { EventParticipantController } from './controller/event-participant.controller';
import { CalendarEvent, CalendarEventSchema } from './schemas';
import {
  EventParticipant,
  EventParticipantSchema,
} from './schemas/event-participant.schema';
import { CalendarEventsService, EventParticipantService } from './service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CalendarEvent.name, schema: CalendarEventSchema },
      { name: EventParticipant.name, schema: EventParticipantSchema },
    ]),
  ],
  controllers: [CalendarEventsController, EventParticipantController],
  providers: [CalendarEventsService, EventParticipantService],
})
export class CalendarEventsModule {}
