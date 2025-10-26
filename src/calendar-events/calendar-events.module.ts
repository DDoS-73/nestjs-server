import { Module } from '@nestjs/common';
import { CalendarEventsController } from './controller';
import { EventParticipantController } from './controller/event-participant.controller';
import { MongoModule } from './infrastructure/mongo/mongo.module';
import { CalendarEventsService, EventParticipantService } from './service';

@Module({
  imports: [MongoModule],
  controllers: [CalendarEventsController, EventParticipantController],
  providers: [CalendarEventsService, EventParticipantService],
})
export class CalendarEventsModule {}
