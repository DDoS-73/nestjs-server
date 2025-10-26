import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventParticipantDocument = HydratedDocument<EventParticipant>;

@Schema({
  collection: 'eventParticipants',
  toJSON: {
    virtuals: true,
    schemaFieldsOnly: true,
    versionKey: false,
    transform: (doc, ret) => {
      return { ...ret, _id: undefined };
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    schemaFieldsOnly: true,
    transform: (doc, ret) => {
      return { ...ret, _id: undefined };
    },
  },
})
export class EventParticipant {
  @Prop({ required: true, unique: true })
  name: string;
}

export const EventParticipantSchema =
  SchemaFactory.createForClass(EventParticipant);
