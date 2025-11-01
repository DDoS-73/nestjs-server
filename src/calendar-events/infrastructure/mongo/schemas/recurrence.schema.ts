import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RecurrenceFrequency } from 'src/calendar-events/entities';

@Schema({ _id: false })
export class Recurrence {
  @Prop({ required: true, enum: RecurrenceFrequency })
  frequency: RecurrenceFrequency;

  @Prop({ default: 1 })
  interval: number; // e.g., every 1 week, or every 2 days

  @Prop({ type: Date, required: false })
  endDate: Date | null; // The date when the recurrence stops
}

// Create the schema corresponding to the class above.
export const RecurrenceSchema = SchemaFactory.createForClass(Recurrence);
