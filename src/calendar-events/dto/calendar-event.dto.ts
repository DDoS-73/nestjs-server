import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsBefore } from 'src/common/decorators/is-before.decorator';
import { DeleteMode } from '../enum/delete-mode';
import { UpdateMode } from '../enum/update-mode';
import { EventParticipantDto } from './event-participant.dto';
import { RecurrenceDto } from './recurrence.dto';

export class CreateCalendarEventDto {
  @IsNotEmpty()
  @IsDate()
  @IsBefore('endTime', { message: 'startTime must be strictly less than endTime' })
  @Transform(({ value }) => new Date(value))
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endTime: Date;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EventParticipantDto)
  participant: EventParticipantDto;

  @ValidateNested()
  @Type(() => RecurrenceDto)
  recurrence: RecurrenceDto;

  exceptions: Date[];
}

export class UpdateCalendarEventDto extends CreateCalendarEventDto {
  @IsString()
  id: string;
}

export class UpdateCalendarEventQueryDto {
  @IsEnum(UpdateMode)
  @IsNotEmpty()
  mode: UpdateMode;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  date: Date;
}

export class DeleteCalendarEventBodyDto {
  @IsEnum(DeleteMode)
  @IsNotEmpty()
  mode: DeleteMode;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  date: Date;
}
