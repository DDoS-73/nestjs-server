import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongoose-config.service';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CalendarEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
