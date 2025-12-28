import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type EventParticipantDocument = HydratedDocument<EventParticipant>;

const transform = (
  doc,
  ret: EventParticipant & {
    _id: mongoose.Types.ObjectId;
    __v: number;
  },
) => {
  if (ret.userId && ret.userId.toString) {
    ret.userId = ret.userId.toString();
  }
  return { ...ret, _id: undefined };
};

@Schema({
  collection: 'eventParticipants',
  toJSON: {
    virtuals: true,
    schemaFieldsOnly: true,
    versionKey: false,
    transform,
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    schemaFieldsOnly: true,
    transform,
  },
})
export class EventParticipant {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId | string;

  @Prop({ required: true, unique: true })
  name: string;
}

export const EventParticipantSchema =
  SchemaFactory.createForClass(EventParticipant);
