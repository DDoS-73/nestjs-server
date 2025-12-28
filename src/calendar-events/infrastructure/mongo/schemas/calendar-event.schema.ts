import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EventParticipant } from './event-participant.schema';
import { Recurrence, RecurrenceSchema } from './recurrence.schema';

export type CalendarEventDocument = HydratedDocument<CalendarEvent>;

const transform = (
  doc,
  ret: CalendarEvent & {
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
  collection: 'calendarEvents',
  toJSON: {
    virtuals: true,
    schemaFieldsOnly: true,
    versionKey: false,
    transform,
  },
  toObject: {
    virtuals: true,
    schemaFieldsOnly: true,
    versionKey: false,
    transform,
  },
})
export class CalendarEvent {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId | string;

  @Prop({ required: true, type: Date })
  startTime: Date;

  @Prop({ required: true, type: Date })
  endTime: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EventParticipant' })
  participant: EventParticipant;

  @Prop({ type: RecurrenceSchema, required: false })
  recurrence?: Recurrence;

  @Prop({ type: [Date], default: [] })
  exceptions: Date[];
}

export const CalendarEventSchema = SchemaFactory.createForClass(CalendarEvent);
