import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { MongoModule } from './infrastructure/mongo/mongo.module';
import { AuthService } from './service/auth.service';
import { JwtConfigService } from './service/jwt-config.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RtStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [
    MongoModule,
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RtStrategy],
})
export class AuthModule {}
