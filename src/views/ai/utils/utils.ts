/**
 * Created by Agruuu
 *
 * AI Enumeration class
 *
 * problem：Why not put it in `src/utils/common-utils.ts`?
 * answer：Mainly, since the AI is an optional module, taking into account independence and decoupling, it is placed in `/views/ai/utils/common-utils.ts`. 
 */

/**  Determine whether the string contains Chinese characters  */
export const hasChinese = (str: string) => {
  return /[\u4e00-\u9fa5]/.test(str)
}
