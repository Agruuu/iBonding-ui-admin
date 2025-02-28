import { floatToFixed2 } from '@/utils'

// Format amount【Split to Yuan】
// @ts-ignore
export const fenToYuanFormat = (_, __, cellValue: any, ___) => {
  return `￥${floatToFixed2(cellValue)}`
}
