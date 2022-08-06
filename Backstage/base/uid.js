const uniqueId = (author, moduleName, category, id) => `@${author}:${moduleName}:${category}:${id}`

const buildIdResolver = idKind => (
   ({ author, moduleName }, id) => {
      if (typeof id === 'object') {
         const {
            author: author1,
            moduleName: moduleName1,
            id: id1
         } = id
         return uniqueId(author1, moduleName1, idKind, id1)
      } else if (id.startsWith('@')) {
         return id
      } else {
         return uniqueId(author, moduleName, idKind, id)
      }
   }
)

const ascensionPerkId = buildIdResolver('ap')
const skillId = buildIdResolver('sk')
const startupId = buildIdResolver('st')
const activityId = buildIdResolver('ac')
const eventId = buildIdResolver('ev')
const modifierId = buildIdResolver('md')
const translationKey = buildIdResolver('tr')

const isTranslationKey = key => key.startsWith('$')
const isAbsoluteTranslationKey = key => key.startsWith('@') && key.indexOf('$') !== -1

module.exports = {
   uniqueId,
   ascensionPerkId,
   skillId,
   startupId,
   activityId,
   eventId,
   modifierId,
   translationKey,

   isTranslationKey,
   isAbsoluteTranslationKey
}
