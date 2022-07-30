const gameContextFunctions = require('./game_context_fn')

const buildGameContext = ruleSet => ({
   ruleSet,

   scope: {
      author: null,
      moduleName: null
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
      skills: {},
      activities: {},
      ascensionPerks: {},

      pressure: 0,
      satisfactory: 100,
      money: 0,
      moneyPerTurn: 0
   },

   events: {
      turnStart: [],
      turnOver: [],
      playerPropertyUpdated: {
         all: [],
         attributes: {
            all: [],
            strength: [],
            intelligence: [],
            emotionalIntelligence: [],
            memorization: [],
            imagination: [],
            charisma: []
         },
         talent: {
            all: [],
            strength: [],
            intelligence: [],
            emotionalIntelligence: [],
            memorization: [],
            imagination: [],
            charisma: []
         },
         skillPoints: []
      },
      skillLearnt: [],
      activityPerformed: [],
      timedEvents: [],
      eventsTriggered: {}
   },
   modifiers: {
      costReductions: []
   },

   connect(signal, slot) {
      gameContextFunctions.connect(this, signal, slot)
   }
})

module.exports = {
   buildGameContext
}
