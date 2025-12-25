import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_REPOSITORY } from 'src/auth/repositories';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepositoryMongo } from './user.repository.mongo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryMongo,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryMongo,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class MongoModule {}
