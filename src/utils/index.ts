import { toNumber } from 'lodash-es'

/**
 *
 * @param component Components that need to be registered
 * @param alias Component alias
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str Hump string that needs to be underlined
 * @returns String underline
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str The underline string that needs to be camel humped
 * @returns String camel hump
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

/**
 * Hump to crossbar
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

/**
 * Find a subscript of an array object
 * @param {Array} ary Array searched for
 * @param {Functon} fn Method of judgment
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time Time required for conversion
 * @param {String} fmt Format to be converted as yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}

/**
 * Generate a random string
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

/**
 * 生成指定长度的随机字符串
 *
 * @param length 字符串长度
 */
export function generateRandomStr(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 根据支持的文件类型生成 accept 属性值
 *
 * @param supportedFileTypes 支持的文件类型数组，如 ['PDF', 'DOC', 'DOCX']
 * @returns 用于文件上传组件 accept 属性的字符串
 */
export const generateAcceptedFileTypes = (supportedFileTypes: string[]): string => {
  const allowedExtensions = supportedFileTypes.map((ext) => ext.toLowerCase())
  const mimeTypes: string[] = []

  // 添加常见的 MIME 类型映射
  if (allowedExtensions.includes('txt')) {
    mimeTypes.push('text/plain')
  }
  if (allowedExtensions.includes('pdf')) {
    mimeTypes.push('application/pdf')
  }
  if (allowedExtensions.includes('html') || allowedExtensions.includes('htm')) {
    mimeTypes.push('text/html')
  }
  if (allowedExtensions.includes('csv')) {
    mimeTypes.push('text/csv')
  }
  if (allowedExtensions.includes('xlsx') || allowedExtensions.includes('xls')) {
    mimeTypes.push('application/vnd.ms-excel')
    mimeTypes.push('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  }
  if (allowedExtensions.includes('docx') || allowedExtensions.includes('doc')) {
    mimeTypes.push('application/msword')
    mimeTypes.push('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  }
  if (allowedExtensions.includes('pptx') || allowedExtensions.includes('ppt')) {
    mimeTypes.push('application/vnd.ms-powerpoint')
    mimeTypes.push('application/vnd.openxmlformats-officedocument.presentationml.presentation')
  }
  if (allowedExtensions.includes('xml')) {
    mimeTypes.push('application/xml')
    mimeTypes.push('text/xml')
  }
  if (allowedExtensions.includes('md') || allowedExtensions.includes('markdown')) {
    mimeTypes.push('text/markdown')
  }
  if (allowedExtensions.includes('epub')) {
    mimeTypes.push('application/epub+zip')
  }
  if (allowedExtensions.includes('eml')) {
    mimeTypes.push('message/rfc822')
  }
  if (allowedExtensions.includes('msg')) {
    mimeTypes.push('application/vnd.ms-outlook')
  }

  // 添加文件扩展名
  const extensions = allowedExtensions.map((ext) => `.${ext}`)

  return [...mimeTypes, ...extensions].join(',')
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

export const generateUUID = () => {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c: any) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(
          16
        )
      }
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
    }
  }
  let timestamp = new Date().getTime()
  let performanceNow =
    (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0
      timestamp = Math.floor(timestamp / 16)
    } else {
      random = (performanceNow + random) % 16 | 0
      performanceNow = Math.floor(performanceNow / 16)
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

/**
 * element Implementation of the file size formatter in Plus.
 *
 * @param row Row data
 * @param column field
 * @param cellValue field value
 */
// @ts-ignore
export const fileSizeFormatter = (row, column, cellValue) => {
  const fileSize = cellValue
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const srcSize = parseFloat(fileSize)
  const index = Math.floor(Math.log(srcSize) / Math.log(1024))
  const size = srcSize / Math.pow(1024, index)
  const sizeStr = size.toFixed(2) //Reserved decimal places
  return sizeStr + ' ' + unitArr[index]
}

/**
 * Copy the values to the target object, and the properties of the target object shall prevail. For example: if `target: {a: 1}` and `source: {a: 2, b: 3}`, the result will be `{a: 2}`.
 * @param target Target Object
 * @param source Source object
 */
export const copyValueToTarget = (target: any, source: any) => {
  const newObj = Object.assign({}, target, source)
  // Delete unnecessary attributes
  Object.keys(newObj).forEach((key) => {
    // Delete the properties that are not in the target object.
    if (Object.keys(target).indexOf(key) === -1) {
      delete newObj[key]
    }
  })
  // Update target object values
  Object.assign(target, newObj)
}

/**
 * Get the parameter values of the link
 * @param key Parameter key names
 * @param urlStr Link address，Default to the current browser address
 */
export const getUrlValue = (key: string, urlStr: string = location.href): string => {
  if (!urlStr || !key) return ''
  const url = new URL(decodeURIComponent(urlStr))
  return url.searchParams.get(key) ?? ''
}

/**
 * Get the parameter values of the link（Value type）
 * @param key Parameter key names
 * @param urlStr Link address，Default to the current browser address
 */
export const getUrlNumberValue = (key: string, urlStr: string = location.href): number => {
  return toNumber(getUrlValue(key, urlStr))
}

/**
 * Build sorting fields
 * @param prop Field Name
 * @param order order
 */
export const buildSortingField = ({ prop, order }) => {
  return { field: prop, order: order === 'ascending' ? 'asc' : 'desc' }
}

// ========== NumberUtils Digital methods ==========

/**
 * Sum of arrays
 *
 * @param values Numerical array
 * @return Sum up result，Default is 0
 */
export const getSumValue = (values: number[]): number => {
  return values.reduce((prev, curr) => {
    const value = Number(curr)
    if (!Number.isNaN(value)) {
      return prev + curr
    } else {
      return prev
    }
  }, 0)
}

// ========== General Amount Method ==========

/**
 * Convert an integer to a fraction with two decimal places retained
 * @param num
 */
export const formatToFraction = (num: number | string | undefined): string => {
  if (typeof num === 'undefined') return '0.00'
  const parsedNumber = typeof num === 'string' ? parseFloat(num) : num
  return (parsedNumber / 100.0).toFixed(2)
}

/**
 * Convert a number to the format like 1.00.
 * When presenting data, use
 *
 * @param num integer
 */
// TODO @Agruuu：See how to integrate it
export const floatToFixed2 = (num: number | string | undefined): string => {
  let str = '0.00'
  if (typeof num === 'undefined') {
    return str
  }
  const f = formatToFraction(num)
  const decimalPart = f.toString().split('.')[1]
  const len = decimalPart ? decimalPart.length : 0
  switch (len) {
    case 0:
      str = f.toString() + '.00'
      break
    case 1:
      str = f.toString() + '0'
      break
    case 2:
      str = f.toString()
      break
  }
  return str
}

/**
 * Convert a fraction to an integer
 * @param num
 */
// TODO @Agruuu：See how to integrate it
export const convertToInteger = (num: number | string | undefined): number => {
  if (typeof num === 'undefined') return 0
  const parsedNumber = typeof num === 'string' ? parseFloat(num) : num
  // TODO If there are still decimals after converting to yuan, they should be rounded up or down
  return Math.round(parsedNumber * 100)
}

/**
 * Yuan to Fen
 */
export const yuanToFen = (amount: string | number): number => {
  return convertToInteger(amount)
}

/**
 * Split to Yuan
 */
export const fenToYuan = (price: string | number): string => {
  return formatToFraction(price)
}

/**
 * Calculate the month on month ratio
 *
 * @param value current value
 * @param reference Compare numerical values
 */
export const calculateRelativeRate = (value?: number, reference?: number) => {
  // Prevent removal 0
  if (!reference || reference == 0) return 0

  return ((100 * ((value || 0) - reference)) / reference).toFixed(0)
}

// ========== ERP Exclusive methods ==========

const ERP_COUNT_DIGIT = 3
const ERP_PRICE_DIGIT = 2

/**
 * 【ERP】format Input number
 *
 * For example, say：Inventory quantity
 *
 * @param num quantity
 * @package digit Reserved decimal places
 * @return Quantity after formatting
 */
export const erpNumberFormatter = (num: number | string | undefined, digit: number) => {
  if (num == null) {
    return ''
  }
  if (typeof num === 'string') {
    num = parseFloat(num)
  }
  // If not number，Then directly return an empty string
  if (isNaN(num)) {
    return ''
  }
  return num.toFixed(digit)
}

/**
 * 【ERP】Format quantity，Keep three decimal places
 *
 * For example, say：Inventory quantity
 *
 * @param num quantity
 * @return Quantity after formatting
 */
export const erpCountInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_COUNT_DIGIT)
}

// noinspection JSCommentMatchesSignature
/**
 * 【ERP】Format quantity，Keep three decimal places
 *
 * @param cellValue quantity
 * @return Quantity after formatting
 */
export const erpCountTableColumnFormatter = (_, __, cellValue: any, ___) => {
  return erpNumberFormatter(cellValue, ERP_COUNT_DIGIT)
}

/**
 * 【ERP】Format amount，Keep two decimal places
 *
 * For example, say：Inventory quantity
 *
 * @param num quantity
 * @return Quantity after formatting
 */
export const erpPriceInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_PRICE_DIGIT)
}

// noinspection JSCommentMatchesSignature
/**
 * 【ERP】Format amount，Keep two decimal places
 *
 * @param cellValue quantity
 * @return Quantity after formatting
 */
export const erpPriceTableColumnFormatter = (_, __, cellValue: any, ___) => {
  return erpNumberFormatter(cellValue, ERP_PRICE_DIGIT)
}

/**
 * 【ERP】Price calculation，Round to two decimal places
 *
 * @param price Price
 * @param count quantity
 * @return Total price。If any of them are empty，Then return undefined
 */
export const erpPriceMultiply = (price: number, count: number) => {
  if (price == null || count == null) {
    return undefined
  }
  return parseFloat((price * count).toFixed(ERP_PRICE_DIGIT))
}

/**
 * 【ERP】Percentage calculation，Round to two decimal places
 *
 * If `total` is 0, then return 0.
 *
 * @param value Current value
 * @param total gross value
 */
export const erpCalculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0
  return ((value / total) * 100).toFixed(2)
}

/**
 * Adapt the place names for ECharts map.
 *
 * @param areaName Regional name
 */
export const areaReplace = (areaName: string) => {
  if (!areaName) {
    return areaName
  }
  return areaName
    .replace('Uyghur Autonomous Region', '')
    .replace('Zhuang Autonomous Region', '')
    .replace('Hui Autonomous Region', '')
    .replace('Autonomous Region', '')
    .replace('province', '')
}

/**
 * analysis JSON string
 *
 * @param str
 */
export function jsonParse(str: string) {
  try {
    return JSON.parse(str)
  } catch (e) {
    console.log(`str[${str}] 不是一个 JSON 字符串`)
    return ''
  }
}

/**
 * Substring a string.
 *
 * @param str 字符串
 * @param start 开始位置
 * @param end 结束位置
 */

export const subString = (str: string, start: number, end: number) => {
  if (str.length > end) {
    return str.slice(start, end)
  }
  return str
}
