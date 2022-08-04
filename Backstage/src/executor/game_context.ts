import { Scope } from '../base/uid'
import { CompiledRuleSet } from '../ruleset'

export class PlayerAttributes {
   strength: number
   intelligence: number
   emotionalIntelligence: number
   memorization: number
   imagination: number
   charisma: number

   constructor(
      strength: number,
      intelligence: number,
      emotionalIntelligence: number,
      memorization: number,
      imagination: number,
      charisma: number
   ) {
      this.strength = strength
      this.intelligence = intelligence
      this.emotionalIntelligence = emotionalIntelligence
      this.memorization = memorization
      this.imagination = imagination
      this.charisma = charisma
   }
}

export class PlayerStatus {}

export class GameContext {
   readonly ruleSet: CompiledRuleSet

   scope?: Scope = undefined
   scopeChain: Scope[] = []

   turns: number = 0
}

const buildGameContext = ruleSet => ({
   ruleSet,

   scope: {
      author: null,
      moduleName: null
   },
   scopeChain: [],

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
      turnStart: {},
      turnOver: {},
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
      skillLearnt: {},
      activityPerformed: {},
      timedEvents: [],
      eventsTriggered: {}
   },
   modifiers: {
      player: {
         attributes: {
            strength: {},
            intelligence: {},
            emotionalIntelligence: {},
            memorization: {},
            imagination: {},
            charisma: {}
         },
         talent: {
            strength: {},
            intelligence: {},
            emotionalIntelligence: {},
            memorization: {},
            imagination: {},
            charisma: {}
         }
      },
      skillPoints: {},
      pressure: {},
      satisfactory: {},
      money: {}
   },

   computedModifiers: null,
   computedSkills: null,
   computedAscensionPerks: null
})
