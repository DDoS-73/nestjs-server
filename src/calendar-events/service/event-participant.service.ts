import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EventParticipant,
  EventParticipantDocument,
} from '../schemas/event-participant.schema';

@Injectable()
export class EventParticipantService {
  constructor(
    @InjectModel(EventParticipant.name)
    private eventParticipantModel: Model<EventParticipantDocument>,
  ) {}

  public getByName(name: string): Promise<EventParticipantDocument | null> {
    return this.eventParticipantModel.findOne({ name }).exec();
  }

  public create(name: string): Promise<EventParticipantDocument> {
    return this.eventParticipantModel.create({ name });
  }

  public getAll(): Promise<EventParticipantDocument[]> {
    return this.eventParticipantModel.find().exec();
  }
}
