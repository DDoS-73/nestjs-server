import { Transform } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { RecurrenceFrequency } from '../entities';

export class RecurrenceDto {
  @IsEnum(RecurrenceFrequency)
  frequency: RecurrenceFrequency;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 1))
  interval: number;

  @Transform(({ value }) => (value ? new Date(value) : null))
  endDate: Date | null;
}
