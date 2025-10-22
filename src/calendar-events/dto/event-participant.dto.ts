import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class EventParticipantDto {
  @IsOptional()
  @IsMongoId()
  id?: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;
}
