const internalTranslations = {
   'zh_cn': {
      '@op_and': '以下条件全部为真',
      '@op_or': '以下任意条件为真',
      '@op_not': '以下条件全部为假',
      '@has_skill': '已习得技能',

      '@broken_potential_result': '错误烫屯锟斤拷锟斤拷锟斤拷锟斤拷'
   }
}

const translateInternalItem = (lang, translations, key) => {
   if (internalTranslations[lang]) {
      if (internalTranslations[lang][key]) {
         return internalTranslations[lang][key]
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

const translateItem = (lang, translations, key) => {
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

const translatePotentialResult = (lang, translations, potentialResult) => {
   const impl = result => {
      switch (result.type) {
         case 'custom':
            return {
               text: translateItem(lang, translations, result.description),
               result: result.result
            }
         case 'logic_op':
            return {
               text: translateInternalItem(lang, translations, `@op_${result.op}`),
               result: result.result,
               arguments: result.resultPieces.map(impl)
            }
         case 'skill':
            return {
               text: translateInternalItem(lang, translations, '@has_skill'),
               arguments: [
                  translateItem(lang, translations, result.skillName)
               ]
            }
         default:
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

module.exports = {
   translateInternalItem,
   translatePotentialResult
}
