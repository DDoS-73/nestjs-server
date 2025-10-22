import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CalendarEventDto } from '../dto';
import { CalendarEventDocument } from '../schemas';
import { CalendarEventsService } from '../service/calendar-events.service';

@Controller('events')
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Post()
  public create(
    @Body() calendarEventDto: CalendarEventDto,
  ): Promise<CalendarEventDocument> {
    return this.calendarEventsService.create(calendarEventDto);
  }

  @Get()
  public getAll(): Promise<CalendarEventDocument[]> {
    return this.calendarEventsService.getAll();
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
    @Body() calendarEventDto: CalendarEventDto,
  ): Promise<CalendarEventDocument> {
    return this.calendarEventsService.update(calendarEventDto);
  }
}
