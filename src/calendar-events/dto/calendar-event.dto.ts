import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DeleteMode } from '../enum/delete-mode';
import { EventParticipantDto } from './event-participant.dto';
import { RecurrenceDto } from './recurrence.dto';

export class CreateCalendarEventDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endTime: Date;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EventParticipantDto)
  participant: EventParticipantDto;

  @ValidateNested()
  @Type(() => RecurrenceDto)
  recurrence: RecurrenceDto;
}

export class UpdateCalendarEventDto extends CreateCalendarEventDto {
  @IsString()
  id: string;
}

export class DeleteCalendarEventDto {
  @IsEnum(DeleteMode)
  @IsNotEmpty()
  mode: DeleteMode;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  date: Date;
}
