import {
  BadRequestException,
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
import {
  CreateCalendarEventDto,
  DeleteCalendarEventBodyDto,
  UpdateCalendarEventDto,
  UpdateCalendarEventQueryDto,
} from '../dto';
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
    if (!from || !to) {
      throw new BadRequestException(
        'Both "from" and "to" query parameters are required.',
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format for "from" or "to". Please use ISO 8601 format.',
      );
    }
    return this.calendarEventsService.getAllInDateRange(fromDate, toDate);
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @Query() deleteEventDto: DeleteCalendarEventBodyDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.calendarEventsService.delete(
      id,
      deleteEventDto.mode,
      deleteEventDto.date,
    );
    return res.status(200).json({ message: 'Success' });
  }

  @Patch(':id')
  public async update(
    @Body() calendarEventDto: UpdateCalendarEventDto,
    @Query() query: UpdateCalendarEventQueryDto,
    @Param('id') id: string,
  ): Promise<CalendarEventEntity> {
    return this.calendarEventsService.update(
      id,
      query.mode,
      query.date,
      calendarEventDto,
    );
  }
}
