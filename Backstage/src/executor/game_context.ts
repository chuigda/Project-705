import { Scope } from '../base/uid'
import { Skill } from '../ruleset/items/skill'
import { Activity } from '../ruleset/items/activity'
import { AscensionPerk } from '../ruleset/items/ascension_perk'
import { CompiledRuleSet } from '../loader'

export class PlayerAttributes {
   strength: number = 0
   intelligence: number = 0
   emotionalIntelligence: number = 0
   memorization: number = 0
   imagination: number = 0
   charisma: number = 0

   constructor(
      optionalArgs?: {
         strength?: number,
         intelligence?: number,
         emotionalIntelligence?: number,
         memorization?: number,
         imagination?: number
         charisma?: number
      }
   ) {
      if (optionalArgs) {
         this.strength = optionalArgs.strength || this.strength
         this.intelligence = optionalArgs.intelligence || this.intelligence
         this.emotionalIntelligence = optionalArgs.emotionalIntelligence || this.emotionalIntelligence
         this.memorization = optionalArgs.memorization || this.memorization
         this.imagination = optionalArgs.imagination || this.imagination
         this.charisma = optionalArgs.charisma || this.charisma
      }
   }
}

export class PlayerStatus {
   attributes: PlayerAttributes = new PlayerAttributes()
   talent: PlayerAttributes = new PlayerAttributes()

   skillPoints: number = 0
   skills: Record<string, Skill> = {}
   activities: Record<string, Activity> = {}
   ascensionPerks: Record<string, AscensionPerk> = {}

   pressure: number = 0
   satisfactory: number = 50
   money: number = 0
   moneyPerTurn: number = 0
}

export class GameContext {
   readonly ruleSet: CompiledRuleSet

   scope?: Scope = undefined
   scopeChain: Scope[] = []

   turns: number = 0
   player: PlayerStatus = new PlayerStatus()

   constructor(ruleSet: CompiledRuleSet) {
      this.ruleSet = ruleSet
   }
}

const buildGameContext = ruleSet => ({
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
