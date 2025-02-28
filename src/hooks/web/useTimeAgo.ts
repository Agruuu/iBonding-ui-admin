import { useTimeAgo as useTimeAgoCore, UseTimeAgoMessages } from '@vueuse/core'
import { useLocaleStoreWithOut } from '@/store/modules/locale'

const TIME_AGO_MESSAGE_MAP: {
  'zh-CN': UseTimeAgoMessages
  en: UseTimeAgoMessages
} = {
  // @ts-ignore
  'zh-CN': {
    justNow: 'Just',
    past: (n) => (n.match(/\d/) ? `${n} front` : n),
    future: (n) => (n.match(/\d/) ? `${n} after` : n),
    month: (n, past) => (n === 1 ? (past ? 'last month' : 'next month') : `${n} month`),
    year: (n, past) => (n === 1 ? (past ? 'last year' : 'next year') : `${n} year`),
    day: (n, past) => (n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day`),
    week: (n, past) => (n === 1 ? (past ? 'last week' : 'next week') : `${n} week`),
    hour: (n) => `${n} hour`,
    minute: (n) => `${n} minute`,
    second: (n) => `${n} second`
  },
  // @ts-ignore
  en: {
    justNow: 'just now',
    past: (n) => (n.match(/\d/) ? `${n} ago` : n),
    future: (n) => (n.match(/\d/) ? `in ${n}` : n),
    month: (n, past) =>
      n === 1 ? (past ? 'last month' : 'next month') : `${n} month${n > 1 ? 's' : ''}`,
    year: (n, past) =>
      n === 1 ? (past ? 'last year' : 'next year') : `${n} year${n > 1 ? 's' : ''}`,
    day: (n, past) => (n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day${n > 1 ? 's' : ''}`),
    week: (n, past) =>
      n === 1 ? (past ? 'last week' : 'next week') : `${n} week${n > 1 ? 's' : ''}`,
    hour: (n) => `${n} hour${n > 1 ? 's' : ''}`,
    minute: (n) => `${n} minute${n > 1 ? 's' : ''}`,
    second: (n) => `${n} second${n > 1 ? 's' : ''}`
  }
}

export const useTimeAgo = (time: Date | number | string) => {
  const localeStore = useLocaleStoreWithOut()

  const currentLocale = computed(() => localeStore.getCurrentLocale)

  const timeAgo = useTimeAgoCore(time, {
    messages: TIME_AGO_MESSAGE_MAP[unref(currentLocale).lang]
  })

  return timeAgo
}
