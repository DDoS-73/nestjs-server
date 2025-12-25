import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { MongoModule } from './infrastructure/mongo/mongo.module';
import { AuthService } from './service/auth.service';
import { JwtConfigService } from './service/jwt-config.service';

@Module({
  imports: [
    MongoModule,
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
