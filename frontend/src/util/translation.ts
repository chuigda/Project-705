import { MaybeTranslationKey } from '@app/core/base/uid'
import { ComposedTranslation, MaybeTranslatable } from '@app/core/base/translation'

let gTranslation: Record<string, string> | null = null

export async function initTranslation(translation: Record<string, string>) {
   gTranslation = translation
}

export function translate(item: MaybeTranslationKey): string {
   item = <string>item
   if (item.startsWith('$') || item.startsWith('@$') || (item.startsWith('@') && item.includes(':tr:$'))) {
      return gTranslation![item] || item
   } else {
      return item
   }
}

export function translate2(item: MaybeTranslatable): string {
   if (typeof item === 'string') {
      return gTranslation![item] || item
   } else {
      const { template, args } = <ComposedTranslation>item

      let ret = translate(template)
      for (const argName in args) {
         const translatedArg = translate2(args[argName])
         ret = ret.replaceAll(`:${argName}:`, translatedArg)
      }
      return ret
   }
}
