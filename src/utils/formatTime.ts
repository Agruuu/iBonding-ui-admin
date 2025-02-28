import dayjs from 'dayjs'
import type { TableColumnCtx } from 'element-plus'

/**
 * The date shortcut option is applicable to el-date-picker
 */
export const defaultShortcuts = [
  {
    text: 'today',
    value: () => {
      return new Date()
    }
  },
  {
    text: 'yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return [date, date]
    }
  },
  {
    text: 'Last seven days',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return [date, new Date()]
    }
  },
  {
    text: 'lately 30 day',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
      return [date, new Date()]
    }
  },
  {
    text: 'This month',
    value: () => {
      const date = new Date()
      date.setDate(1) // Set as the first day of the current month
      return [date, new Date()]
    }
  },
  {
    text: 'this year',
    value: () => {
      const date = new Date()
      return [new Date(`${date.getFullYear()}-01-01`), date]
    }
  }
]

/**
 * Time date conversion
 * @param date current time ，new Date() format
 * @param format Time format string that needs to be converted
 * @description format String arbitrary，as `YYYY-MM、YYYY-MM-DD`
 * @description format quarter："YYYY-MM-DD HH:mm:ss QQQQ"
 * @description format week："YYYY-MM-DD HH:mm:ss WWW"
 * @description format How many weeks："YYYY-MM-DD HH:mm:ss ZZZ"
 * @description format quarter + week + weeks："YYYY-MM-DD HH:mm:ss WWW QQQQ ZZZ"
 * @returns Return the concatenated time string
 */
export function formatDate(date: Date, format?: string): string {
  // Date does not exist，Return empty
  if (!date) {
    return ''
  }
  // Date exists，Then format it
  return date ? dayjs(date).format(format ?? 'YYYY-MM-DD HH:mm:ss') : ''
}

/**
 * Get the current date+time
 */
export function getNowDateTime() {
  return dayjs()
}

/**
 * What week is the current date obtained
 * @param dateTime The current incoming date value
 * @returns Return the numerical value of the week
 */
export function getWeek(dateTime: Date): number {
  const temptTime = new Date(dateTime.getTime())
  // What day of the week
  const weekday = temptTime.getDay() || 7
  // Monday + 5 days = Saturday.
  temptTime.setDate(temptTime.getDate() - weekday + 1 + 5)
  let firstDay = new Date(temptTime.getFullYear(), 0, 1)
  const dayOfWeek = firstDay.getDay()
  let spendDay = 1
  if (dayOfWeek != 0) spendDay = 7 - dayOfWeek + 1
  firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay)
  const d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000)
  return Math.ceil(d / 7)
}

/**
 * Convert time to `A few seconds ago`、`A few minutes ago`、`A few hours ago`、`a few days ago`
 * @param param current time ，new Date() format or string time format
 * @param format Time format string that needs to be converted
 * @description param 10second：  10 * 1000
 * @description param 1branch：   60 * 1000
 * @description param 1hour： 60 * 60 * 1000
 * @description param 24hour：60 * 60 * 24 * 1000
 * @description param 3day：   60 * 60* 24 * 1000 * 3
 * @returns Return the concatenated time string
 */
export function formatPast(param: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  // Input format processing、Store conversion values
  let t: any, s: number
  // obtainjs time stamp
  let time: number = new Date().getTime()
  // Is it an object
  typeof param === 'string' || 'object' ? (t = new Date(param).getTime()) : (t = param)
  // Current timestamp - Enter timestamp
  time = Number.parseInt(`${time - t}`)
  if (time < 10000) {
    // 10Within seconds
    return 'just'
  } else if (time < 60000 && time >= 10000) {
    // exceed10Less than seconds1Within minutes
    s = Math.floor(time / 1000)
    return `${s}A second ago`
  } else if (time < 3600000 && time >= 60000) {
    // exceed1Less than minutes1hour
    s = Math.floor(time / 60000)
    return `${s}Minutes ago`
  } else if (time < 86400000 && time >= 3600000) {
    // exceed1Less than hours24hour
    s = Math.floor(time / 3600000)
    return `${s}Hours ago`
  } else if (time < 259200000 && time >= 86400000) {
    // exceed1Less than days3Within the day
    s = Math.floor(time / 86400000)
    return `${s}Days ago`
  } else {
    // exceed3day
    const date = typeof param === 'string' || 'object' ? new Date(param) : param
    return formatDate(date, format)
  }
}

/**
 * Time greetings
 * @param param current time ，new Date() format
 * @description param call `formatAxis(new Date())` output `Good morning`
 * @returns Return the concatenated time string
 */
export function formatAxis(param: Date): string {
  const hour: number = new Date(param).getHours()
  if (hour < 6) return 'Good morning'
  else if (hour < 9) return 'Good morning'
  else if (hour < 12) return 'Good morning'
  else if (hour < 14) return 'Good noon'
  else if (hour < 17) return 'Good afternoon'
  else if (hour < 19) return 'Good evening'
  else if (hour < 22) return 'Good evening'
  else return 'Good night'
}

/**
 * Convert milliseconds，Convert to a time string。For example, say，xx minute
 *
 * @param ms millisecond
 * @returns {string} character string
 */
export function formatPast2(ms: number): string {
  const day = Math.floor(ms / (24 * 60 * 60 * 1000))
  const hour = Math.floor(ms / (60 * 60 * 1000) - day * 24)
  const minute = Math.floor(ms / (60 * 1000) - day * 24 * 60 - hour * 60)
  const second = Math.floor(ms / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60)
  if (day > 0) {
    return day + ' day' + hour + ' hour ' + minute + ' minute'
  }
  if (hour > 0) {
    return hour + ' hour ' + minute + ' minute'
  }
  if (minute > 0) {
    return minute + ' minute'
  }
  if (second > 0) {
    return second + ' second'
  } else {
    return 0 + ' second'
  }
}

/**
 * Implementation of the time formatter in ElementPlus using the "YYYY-MM-DD HH:mm:ss" format.
 *
 * @param row Row data
 * @param column field
 * @param cellValue field value
 */
export function dateFormatter(_row: any, _column: TableColumnCtx<any>, cellValue: any): string {
  return cellValue ? formatDate(cellValue) : ''
}

/**
 * Implementation of the time formatter in ElementPlus using the "YYYY-MM-DD" format.
 *
 * @param row Row data
 * @param column field
 * @param cellValue field value
 */
export function dateFormatter2(_row: any, _column: TableColumnCtx<any>, cellValue: any): string {
  return cellValue ? formatDate(cellValue, 'YYYY-MM-DD') : ''
}

/**
 * Set start date，The time is 00:00:00
 * @param param Date of transmission
 * @returns A date with the time of 00:00:00.
 */
export function beginOfDay(param: Date): Date {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 0, 0, 0)
}

/**
 * Set end date，The time is 23:59:59
 * @param param Date of transmission
 * @returns A date with the time of 23:59:59.
 */
export function endOfDay(param: Date): Date {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 23, 59, 59)
}

/**
 * Calculate the number of days between two dates
 * @param param1 date1
 * @param param2 date2
 */
export function betweenDay(param1: Date, param2: Date): number {
  param1 = convertDate(param1)
  param2 = convertDate(param2)
  // Calculate the difference
  return Math.floor((param2.getTime() - param1.getTime()) / (24 * 3600 * 1000))
}

/**
 * Date calculation
 * @param param1 date
 * @param param2 Added time
 */
export function addTime(param1: Date, param2: number): Date {
  param1 = convertDate(param1)
  return new Date(param1.getTime() + param2)
}

/**
 * Date Conversion
 * @param param date
 */
export function convertDate(param: Date | string): Date {
  if (typeof param === 'string') {
    return new Date(param)
  }
  return param
}

/**
 * Two specified dates, Is it on the same day
 * @param a date A
 * @param b date B
 */
export function isSameDay(a: dayjs.ConfigType, b: dayjs.ConfigType): boolean {
  if (!a || !b) return false

  const aa = dayjs(a)
  const bb = dayjs(b)
  return aa.year() == bb.year() && aa.month() == bb.month() && aa.day() == bb.day()
}

/**
 * Get the start time of a day、deadline
 * @param date date
 * @param days Number of days
 */
export function getDayRange(
  date: dayjs.ConfigType,
  days: number
): [dayjs.ConfigType, dayjs.ConfigType] {
  const day = dayjs(date).add(days, 'd')
  return getDateRange(day, day)
}

/**
 * Get Recent7The start time of the sky、deadline
 */
export function getLast7Days(): [dayjs.ConfigType, dayjs.ConfigType] {
  const lastWeekDay = dayjs().subtract(7, 'd')
  const yesterday = dayjs().subtract(1, 'd')
  return getDateRange(lastWeekDay, yesterday)
}

/**
 * Get Recent30The start time of the sky、deadline
 */
export function getLast30Days(): [dayjs.ConfigType, dayjs.ConfigType] {
  const lastMonthDay = dayjs().subtract(30, 'd')
  const yesterday = dayjs().subtract(1, 'd')
  return getDateRange(lastMonthDay, yesterday)
}

/**
 * Get Recent1Starting time of the year、deadline
 */
export function getLast1Year(): [dayjs.ConfigType, dayjs.ConfigType] {
  const lastYearDay = dayjs().subtract(1, 'y')
  const yesterday = dayjs().subtract(1, 'd')
  return getDateRange(lastYearDay, yesterday)
}

/**
 * Get the start time of the specified date、deadline
 * @param beginDate Start date
 * @param endDate closing date
 */
export function getDateRange(
  beginDate: dayjs.ConfigType,
  endDate: dayjs.ConfigType
): [string, string] {
  return [
    dayjs(beginDate).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
    dayjs(endDate).endOf('d').format('YYYY-MM-DD HH:mm:ss')
  ]
}
