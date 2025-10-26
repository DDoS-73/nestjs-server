import {
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EventParticipantDto } from './event-participant.dto';

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
}

export class UpdateCalendarEventDto extends CreateCalendarEventDto {
  @IsString()
  id: string;
}
