import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { CalendarEventDto } from '../dto';
import { CalendarEvent, CalendarEventDocument } from '../schemas';
import { EventParticipantService } from './event-participant.service';

@Injectable()
export class CalendarEventsService {
  constructor(
    @InjectModel(CalendarEvent.name)
    private calendarEventModel: Model<CalendarEvent>,
    private eventParticipantService: EventParticipantService,
  ) {}

  public async create(
    calendarEventDto: CalendarEventDto,
  ): Promise<CalendarEventDocument> {
    const participantId = await this._handleParticipantId(calendarEventDto);

    return this.calendarEventModel.create({
      startTime: calendarEventDto.startTime,
      endTime: calendarEventDto.endTime,
      participant: participantId,
    });
  }

  public getAll(from: string, to: string): Promise<CalendarEventDocument[]> {
    return this.calendarEventModel
      .find({
        startTime: { $gte: from },
        endTime: { $lte: to },
      })
      .populate('participant')
      .exec();
  }

  public delete(_id: string): Promise<DeleteResult> {
    return this.calendarEventModel.deleteOne({ _id }).exec();
  }

  public async update(
    calendarEventDto: CalendarEventDto,
  ): Promise<CalendarEventDocument> {
    const participantId = await this._handleParticipantId(calendarEventDto);

    const updatedEvent = await this.calendarEventModel
      .findByIdAndUpdate(
        calendarEventDto.id,
        {
          startTime: calendarEventDto.startTime,
          endTime: calendarEventDto.endTime,
          participant: participantId,
        },
        { new: true },
      )
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException(
        `Calendar event with id ${calendarEventDto.id?.toString()} not found`,
      );
    }

    return updatedEvent;
  }

  private async _handleParticipantId(
    calendarEventDto: CalendarEventDto,
  ): Promise<string> {
    if (!calendarEventDto.participant.id) {
      const eventParticipant = await this.eventParticipantService.create(
        calendarEventDto.participant.name,
      );
      return eventParticipant._id.toString();
    }

    return calendarEventDto.participant.id.toString();
  }
}
