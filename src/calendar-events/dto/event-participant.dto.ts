import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EventParticipantDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
export class CreateEventParticipantDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
