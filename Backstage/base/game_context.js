const { uniqueId } = require('./uid')

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
   modifiers: {
      costReductions: []
   },

   loadedRuleSets: {
      skillCategories: {},
      activityCategories: [],
      events: {},
      modifiers: {},
      skills: {},
      activities: {},
      ascensionPerks: {},

      installedHooks: {
         player: {
            attributes: {},
            talent: {},
            skills: {},
            activities: {},
            ascensionPerks: {},
            pressure: {},
            satisfactory: {},
            money: {}
         },
         modifiers: {
            costReductions: {}
         }
      }
   },

   scheduleEvent: (gameContext, eventId) => {
      // TODO
   },
   updatePlayerAttributes: (gameContext, attributes) => {
      // TODO
   }
})

module.exports = {
   buildGameContext
}
