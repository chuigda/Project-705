
let translation: Record<string, string> | null = null

export async function initTranslation(lang: string) {
   if (!translation) {
      const r = await fetch(`/api/translation?` + new URLSearchParams({ lang }))
      const { success, result } = await r.json()
      if (!success) {
         // TODO: error handling
      }
      translation = result
   }
}

export function translate(item: string): string {
   if (item.startsWith('$')) {
      return translation![item] || item
   } else {
      return item
   }
}