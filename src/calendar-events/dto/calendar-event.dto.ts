import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
import { EventParticipantDto } from './event-participant.dto';

export class CalendarEventDto {
  @IsOptional()
  @IsMongoId()
  id?: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsNotEmpty()
  @ValidateNested()
  participant: EventParticipantDto;
}
