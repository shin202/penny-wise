import dayjs from 'dayjs'

export class DateUtils {
  static get lastSevenDays() {
    return Array.from({ length: 7 }, (_, i) => {
      return dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    }).reverse()
  }
}
