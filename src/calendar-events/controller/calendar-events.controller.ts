import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CalendarEventEntity } from 'src/calendar-events/entities';
import { CreateCalendarEventDto, UpdateCalendarEventDto } from '../dto';
import { CalendarEventsService } from '../service/calendar-events.service';

@Controller('events')
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Post()
  public create(
    @Body() calendarEventDto: CreateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    return this.calendarEventsService.create(calendarEventDto);
  }

  @Get()
  public getAll(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<CalendarEventEntity[]> {
    return this.calendarEventsService.getAllInDateRange(from, to);
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.calendarEventsService.delete(id);
    return res.status(200).json({ message: 'Success' });
  }

  @Patch(':id')
  public async update(
    @Body() calendarEventDto: UpdateCalendarEventDto,
    @Param('id') id: string,
  ): Promise<CalendarEventEntity> {
    return this.calendarEventsService.update(id, calendarEventDto);
  }
}
