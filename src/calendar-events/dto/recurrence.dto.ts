import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { RecurrenceFrequency } from '../entities';

export class RecurrenceDto {
  @IsEnum(RecurrenceFrequency)
  frequency: RecurrenceFrequency;

  @IsInt()
  @Min(1)
  @IsOptional()
  interval?: number;

  @IsOptional()
  @IsDateString()
  endDate: string | null;
}
