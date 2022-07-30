const isTranslationKey = key => key.startsWith('$')
const isAbsoluteTranslationKey = key => key.startsWith('@')

module.exports = {
   isTranslationKey,
   isAbsoluteTranslationKey
}
