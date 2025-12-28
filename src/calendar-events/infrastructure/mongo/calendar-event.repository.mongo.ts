import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
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
    userId: string,
  ): Promise<CalendarEventEntity[]> {
    return await this.calendarEventModel
      .find({
        userId,
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
    calendarEvent: CalendarEventEntity,
  ): Promise<CalendarEventEntity> {
    const document: CalendarEventDocument =
      await this.calendarEventModel.create({
        ...calendarEvent,
        participant: calendarEvent.participant.id,
      });
    await document.populate('participant');
    return plainToInstance(CalendarEventEntity, document.toObject());
  }

  public async update(
    id: string,
    calendarEvent: CalendarEventEntity,
    userId: string,
  ): Promise<CalendarEventEntity | null> {
    const updatedEvent: CalendarEventDocument | null =
      await this.calendarEventModel
        .findOneAndUpdate(
          { _id: id, userId },
          {
            ...calendarEvent,
            participant: calendarEvent.participant.id,
          },
          { new: true },
        )
        .populate('participant')
        .exec();

    return updatedEvent
      ? plainToInstance(CalendarEventEntity, updatedEvent.toObject())
      : null;
  }

  public async delete(id: string, userId: string): Promise<void> {
    await this.calendarEventModel.deleteOne({ _id: id, userId }).exec();
  }

  public async findById(
    id: string,
    userId: string,
  ): Promise<CalendarEventEntity | null> {
    const event: CalendarEventDocument | null = await this.calendarEventModel
      .findOne({ _id: id, userId })
      .populate('participant')
      .exec();
    return event
      ? plainToInstance(CalendarEventEntity, event.toObject())
      : null;
  }
}
