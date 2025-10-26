import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { CreateEventParticipantDto } from 'src/calendar-events/dto';
import { EventParticipantEntity } from 'src/calendar-events/entities';
import {
  EventParticipant,
  EventParticipantDocument,
} from 'src/calendar-events/infrastructure/mongo/schemas/event-participant.schema';
import { IEventParticipantRepository } from 'src/calendar-events/repositories';

export class EventParticipantRepositoryMongo
  implements IEventParticipantRepository
{
  constructor(
    @InjectModel(EventParticipant.name)
    private eventParticipantModel: Model<EventParticipantDocument>,
  ) {}

  public async getAll(): Promise<EventParticipantEntity[]> {
    const documents = await this.eventParticipantModel.find().exec();
    return plainToInstance(
      EventParticipantEntity,
      documents.map((doc) => doc.toObject()),
    );
  }

  public async getByName(name: string): Promise<EventParticipantEntity | null> {
    const document = await this.eventParticipantModel
      .findOne({ name })
      .lean()
      .exec();
    return document ? plainToInstance(EventParticipantEntity, document) : null;
  }

  public async create(
    eventParticipant: CreateEventParticipantDto,
  ): Promise<EventParticipantEntity> {
    const document: EventParticipantDocument =
      await this.eventParticipantModel.create(eventParticipant);
    return plainToInstance(EventParticipantEntity, document.toObject());
  }
}
