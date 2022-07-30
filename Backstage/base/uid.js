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

const ascensionPerkId = buildIdResolver('ascension_perk')
const skillId = buildIdResolver('skill')
const startupId = buildIdResolver('startup')
const activityId = buildIdResolver('activity')
const eventId = buildIdResolver('event')
const modifierId = buildIdResolver('modifier')
const translationKey = buildIdResolver('tr')

module.exports = {
   uniqueId,
   ascensionPerkId,
   skillId,
   startupId,
   activityId,
   eventId,
   modifierId,
   translationKey
}
