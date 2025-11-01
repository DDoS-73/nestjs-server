import {
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { EventParticipantDto } from './event-participant.dto';
import { RecurrenceDto } from './recurrence.dto';
import { Type } from 'class-transformer';

export class CreateCalendarEventDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsNotEmpty()
  @ValidateNested()
  participant: EventParticipantDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrenceDto)
  recurrence?: RecurrenceDto;
}

export class UpdateCalendarEventDto extends CreateCalendarEventDto {
  @IsString()
  id: string;
}
