import InternalTranslations from '@app/repr/internal_translations'
import {
   PotentialFunctionResult,
   PotentialLogicOpResult,
   SkillPotentialResult
} from '@app/executor/compute'

export function translateInternalItem(
   lang: string,
   translations: Record<string, Record<string, string>>,
   key: string
) {
   if (InternalTranslations[lang]) {
      if (InternalTranslations[lang][key]) {
         return InternalTranslations[lang][key]
      }
   }

   if (translations[lang]) {
      if (translations[lang][key]) {
         return translations[lang][key]
      }
   }

   console.warn(`[W] [translateInternalItem] missing translation for key '${key}'`)
   return key
}

export function translateItem(
   lang: string,
   translations: Record<string, Record<string, string>>,
   key: string
) {
   if (!key.startsWith('@')) {
      return key
   }

   if (translations[lang]) {
      if (translations[lang][key]) {
         return translations[lang][key]
      }
   }

   console.warn(`[W] [translateItem] missing translation for key '${key}'`)
   return key
}

export function translatePotentialResult(
   lang: string,
   translations: Record<string, Record<string, string>>,
   potentialResult: SkillPotentialResult[]
): object {
   function impl(result: SkillPotentialResult): object {
      if (result instanceof PotentialFunctionResult) {
         return {
            text: translateItem(lang, translations, result.description),
            result: result.result
         }
      } else if (result instanceof PotentialLogicOpResult) {
         return {
            text: translateInternalItem(lang, translations, `@op_${result.op}`),
            result: result.result,
            arguments: result.resultPieces.map(impl)
         }
      } else {
         return {
            text: translateInternalItem(lang, translations, '@broken_potential_result')
         }
      }
   }

   if (potentialResult.length === 1) {
      return impl(potentialResult[0])
   } else {
      return {
         text: translateInternalItem(lang, translations, '@op_and'),
         arguments: potentialResult.map(impl)
      }
   }
}
