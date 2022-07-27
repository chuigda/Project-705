const { uniqueId } = require('./uid')

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
         return uniqueId(author, moduleName, id)
      }
   }
)

const ascensionPerkId = buildIdResolver('ascension_perk')
const skillId = buildIdResolver('skill')
const activityId = buildIdResolver('activity')
const eventId = buildIdResolver('event')
const modifierId = buildIdResolver('modifier')

const buildGameContext = () => ({
   scope: {
      author: null,
      name: null
   },

   turns: 0,
   player: {
      attributes: {
         strength: 0,
         intelligence: 0,
         emotionalIntelligence: 0,
         memorization: 0,
         imagination: 0,
         charisma: 0
      },
      talent: {
         strength: 0,
         intelligence: 0,
         emotionalIntelligence: 0,
         memorization: 0,
         imagination: 0,
         charisma: 0
      },
      skillPoints: 0,
      skills: [],
      activities: [],
      ascensionPerks: [],

      pressure: 0,
      satisfactory: 100,
      money: 0
   },
   events: {
      turnStart: [],
      turnOver: [],
      gain: {
         all: [],
         strength: [],
         intelligence: [],
         emotionalIntelligence: [],
         memorization: [],
         imagination: [],
         charisma: [],
         skillPoints: []
      },
      skillLearnt: [],
      performActivity: [],

      timedEvents: [],
   },
   modifiers: [],

   loadedRuleSets: {
      skillCategories: {},
      activityCategories: [],
      events: {},
      modifiers: {},
      skills: {},
      activities: {},
      ascensionPerks: {}
   },

   fn: {
   }
})

module.exports = {
   ascensionPerkId,
   skillId,
   activityId,
   eventId,
   modifierId,
   buildGameContext
}
