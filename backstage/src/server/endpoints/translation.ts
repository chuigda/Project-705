import ruleSet from '@app/server/ruleset'

export default function epGetTranslation(lang: any): Record<string, string> | undefined {
   if (lang && typeof lang === 'string') {
      return ruleSet.translations[lang] || {}
   }
   return undefined
}
