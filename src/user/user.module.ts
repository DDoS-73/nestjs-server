import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { MongoModule } from './infrastructure/mongo/mongo.module';
import { UserService } from './service/user.service';

@Module({
  imports: [MongoModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongoModule],
})
export class UserModule {}
