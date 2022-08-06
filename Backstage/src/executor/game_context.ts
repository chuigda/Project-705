import { Event } from '../ruleset/items/event'
import { Scope } from '../base/uid'
import { Skill } from '../ruleset/items/skill'
import { Activity } from '../ruleset/items/activity'
import { AscensionPerk } from '../ruleset/items/ascension_perk'
import { CompiledRuleSet } from '../loader'
import { ComputedAscensionPerks, ComputedSkills } from './compute'

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

export class AttributeEvents {
   all: Set<string> = new Set()
   strength: Set<string> = new Set()
   intelligence: Set<string> = new Set()
   emotionalIntelligence: Set<string> = new Set()
   memorization: Set<string> = new Set()
   imagination: Set<string> = new Set()
   charisma: Set<string> = new Set()
}

export class PlayerPropertyUpdatedEvents {
   all: Set<string> = new Set()
   skillPoints: Set<string> = new Set()
   attributes: AttributeEvents = new AttributeEvents()
   talent: AttributeEvents = new AttributeEvents()
}

export class TimedEvent {
   turn: number
   eventId: string
}

export class GameContextEvents {
   turnStart: Set<string> = new Set()
   turnOver: Set<string> = new Set()
   playerPropertyUpdated: PlayerPropertyUpdatedEvents = new PlayerPropertyUpdatedEvents()
   skillLearnt: Record<string, Set<string>> = {}
   activityPerformed: Record<string, Set<string>> = {}
   eventsTriggered: Record<string, Set<string>> = {}

   timedEvents: TimedEvent[]
}

export class GameContext {
   readonly ruleSet: CompiledRuleSet

   scope?: Scope = undefined
   scopeChain: Scope[] = []

   turns: number = 0
   player: PlayerStatus = new PlayerStatus()

   events: GameContextEvents = new GameContextEvents()
   modifiers: object = {}

   computedModifier?: object = undefined
   computedSkills?: ComputedSkills = undefined
   computedAscensionPerks?: ComputedAscensionPerks = undefined

   constructor(ruleSet: CompiledRuleSet) {
      this.ruleSet = ruleSet
   }
}
