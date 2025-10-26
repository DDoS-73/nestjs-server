import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import {
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
} from 'src/calendar-events/dto';
import { CalendarEventEntity } from 'src/calendar-events/entities';
import {
  CalendarEvent,
  CalendarEventDocument,
} from 'src/calendar-events/infrastructure/mongo/schemas/calendar-event.schema';
import { ICalendarEventRepository } from 'src/calendar-events/repositories';

export class CalendarEventRepositoryMongo implements ICalendarEventRepository {
  constructor(
    @InjectModel(CalendarEvent.name)
    private calendarEventModel: Model<
      CalendarEventDocument,
      CalendarEventEntity
    >,
  ) {}

  public async getAllInDateRange(
    from: string,
    to: string,
  ): Promise<CalendarEventEntity[]> {
    const events: CalendarEventDocument[] = await this.calendarEventModel
      .find({
        startTime: { $gte: from },
        endTime: { $lte: to },
      })
      .populate('participant')
      .exec();

    return plainToInstance(
      CalendarEventEntity,
      events.map((event) => event.toObject()),
    );
  }

  public async create(
    calendarEvent: CreateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    const document = await this.calendarEventModel.create({
      ...calendarEvent,
      participant: calendarEvent.participant.id,
    });
    return plainToInstance(CalendarEventEntity, document);
  }

  public async update(
    id: string,
    calendarEvent: UpdateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    const updatedEvent = await this.calendarEventModel
      .findByIdAndUpdate(
        id,
        {
          ...calendarEvent,
          participant: calendarEvent.participant.id,
        },
        { new: true },
      )
      .exec();

    return plainToInstance(CalendarEventEntity, updatedEvent);
  }

  public async delete(id: string): Promise<void> {
    await this.calendarEventModel.deleteOne({ _id: id }).exec();
  }
}
