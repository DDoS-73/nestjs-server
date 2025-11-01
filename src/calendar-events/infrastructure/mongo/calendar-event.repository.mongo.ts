import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import {
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
} from 'src/calendar-events/dto';
import {
  CalendarEventEntity,
  RecurrenceFrequency,
} from 'src/calendar-events/entities';
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
    from: Date,
    to: Date,
  ): Promise<CalendarEventEntity[]> {
    return await this.calendarEventModel
      .find({
        startTime: { $lte: to },
        $or: [
          {
            'recurrence.frequency': RecurrenceFrequency.NONE,
            endTime: { $gte: from },
          },
          {
            'recurrence.frequency': { $ne: RecurrenceFrequency.NONE },
            $or: [
              { 'recurrence.endDate': null },
              { 'recurrence.endDate': { $gte: from } },
            ],
          },
        ],
      })
      .populate('participant')
      .exec()
      .then((events) =>
        plainToInstance(
          CalendarEventEntity,
          events.map((event) => event.toObject()),
        ),
      );
  }

  public async create(
    calendarEvent: CreateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    const document: CalendarEventDocument =
      await this.calendarEventModel.create({
        ...calendarEvent,
        participant: calendarEvent.participant.id,
      });
    return plainToInstance(CalendarEventEntity, document.toObject());
  }

  public async update(
    id: string,
    calendarEvent: UpdateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    const updatedEvent: CalendarEventDocument | null =
      await this.calendarEventModel
        .findByIdAndUpdate(
          id,
          {
            ...calendarEvent,
            participant: calendarEvent.participant.id,
          },
          { new: true },
        )
        .exec();

    return plainToInstance(CalendarEventEntity, updatedEvent?.toObject());
  }

  public async delete(id: string): Promise<void> {
    await this.calendarEventModel.deleteOne({ _id: id }).exec();
  }
}
