import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EventParticipant } from './event-participant.schema';

export type CalendarEventDocument = HydratedDocument<CalendarEvent>;

@Schema({
  collection: 'calendarEvents',
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
    schemaFieldsOnly: true,
    versionKey: false,
    transform: (doc, ret) => {
      return { ...ret, _id: undefined };
    },
  },
})
export class CalendarEvent {
  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EventParticipant' })
  participant: EventParticipant;
}

export const CalendarEventSchema = SchemaFactory.createForClass(CalendarEvent);
