import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import week from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(week);
dayjs.extend(isoWeek);

@Injectable()
export class DateProvider {
  private readonly timezone: string;

  constructor(private readonly configService: ConfigService) {
    this.timezone = this.configService.get<string>('timezone');
  }

  get today() {
    return dayjs().tz(this.timezone);
  }

  get currentWeek() {
    return dayjs().tz(this.timezone).week();
  }

  get lastFourWeeks() {
    return Array.from({ length: 4 }, (_, i) => {
      return dayjs().tz(this.timezone).subtract(i, 'week').isoWeek();
    });
  }

  get currentYear() {
    return dayjs().tz(this.timezone).year();
  }

  format(date: Date | string, format: string) {
    return dayjs(date).tz(this.timezone).format(format);
  }
}
