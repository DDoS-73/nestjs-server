import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  toJSON: {
    virtuals: true,
    schemaFieldsOnly: true,
    versionKey: false,
    transform: (doc, ret) => {
      return { ...ret, _id: undefined };
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    schemaFieldsOnly: true,
    transform: (doc, ret) => {
      return { ...ret, _id: undefined };
    },
  },
})
export class User {
  @Prop({ required: true, maxlength: 25 })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 5 })
  password: string;
}

export const UserSchema =
  SchemaFactory.createForClass(User);
