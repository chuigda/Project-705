import { ITranslatable, ITranslationKey } from '@protocol/index'
import { getTranslation } from '@app/api'

let translation: Record<string, string> | null = null

export async function initTranslation(lang: string) {
   if (!translation) {
      translation = await getTranslation(lang)
   }
}

export function translate(item: ITranslationKey): string {
   if (item.startsWith('$') || item.startsWith('@$') || (item.startsWith('@') && item.includes(':tr:$'))) {
      return translation![item] || item
   } else {
      return item
   }
}

export function translate2(item: ITranslatable): string {
   if (typeof item === 'string') {
      return translation![item] || item
   } else {
      const { template, args } = item

      let ret = translate(template)
      for (const argName in args) {
         const translatedArg = translate2(args[argName])
         ret = ret.replaceAll(`:${argName}:`, translatedArg)
      }
      return ret
   }
}
