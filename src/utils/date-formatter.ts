import dayjs from 'dayjs'

export const dateFormatter = (date: Date | string): string => {
  return dayjs(date).format('DD/MM/YYYYTHH:mm:ss')
}
