import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { JwtPayload } from 'src/auth/models';
import { CalendarEventEntity } from 'src/calendar-events/entities';
import {
  CreateCalendarEventDto,
  DeleteCalendarEventBodyDto,
  UpdateCalendarEventDto,
  UpdateCalendarEventQueryDto,
} from '../dto';
import { CalendarEventsService } from '../service/calendar-events.service';

@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Post()
  public create(
    @Body() calendarEventDto: CreateCalendarEventDto,
    @Req() req: Request,
  ): Promise<CalendarEventEntity> {
    const user = req.user as JwtPayload;
    return this.calendarEventsService.create(calendarEventDto, user.id);
  }

  @Get()
  public getAll(
    @Query('from') from: string,
    @Query('to') to: string,
    @Req() req: Request,
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
    const user = req.user as JwtPayload;
    return this.calendarEventsService.getAllInDateRange(
      fromDate,
      toDate,
      user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('id') id: string,
    @Query() deleteEventDto: DeleteCalendarEventBodyDto,
    @Req() req: Request,
  ): Promise<void> {
    const user = req.user as JwtPayload;
    await this.calendarEventsService.delete(
      id,
      deleteEventDto.mode,
      deleteEventDto.date,
      user.id,
    );
  }

  @Patch(':id')
  public async update(
    @Body() calendarEventDto: UpdateCalendarEventDto,
    @Query() query: UpdateCalendarEventQueryDto,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<CalendarEventEntity> {
    const user = req.user as JwtPayload;
    return this.calendarEventsService.update(
      id,
      query.mode,
      query.date,
      calendarEventDto,
      user.id,
    );
  }
}
