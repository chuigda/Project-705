import { Scope } from '../base/uid'
import { Skill } from '../ruleset/items/skill'
import { Activity } from '../ruleset/items/activity'
import { AscensionPerk } from '../ruleset/items/ascension_perk'
import { CompiledRuleSet } from '../loader'
import { Event } from 'ruleset/items/event'
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
   all: Record<string, Event> = {}
   strength: Record<string, Event> = {}
   intelligence: Record<string, Event> = {}
   emotionalIntelligence: Record<string, Event> = {}
   memorization: Record<string, Event> = {}
   imagination: Record<string, Event> = {}
   charisma: Record<string, Event> = {}
}

export class PlayerPropertyUpdatedEvents {
   all: Record<string, Event> = {}
   skillPoints: Record<string, Event> = {}
   attributes: AttributeEvents = new AttributeEvents
   talent: AttributeEvents = new AttributeEvents
}

export class TimedEvent {
   turn: number
   event: Event
}

export class GameContextEvents {
   turnStart: Record<string, Event> = {}
   turnOver: Record<string, Event> = {}
   playerPropertyUpdated: PlayerPropertyUpdatedEvents = new PlayerPropertyUpdatedEvents
   skillLearnt: Record<string, Record<string, Event>> = {}
   activityPerformed: Record<string, Record<string, Event>> = {}
   eventsTriggered: Record<string, Record<string, Event>> = {}

   timedEvents: TimedEvent[]
}

export class GameContext {
   readonly ruleSet: CompiledRuleSet

   scope?: Scope = undefined
   scopeChain: Scope[] = []

   turns: number = 0
   player: PlayerStatus = new PlayerStatus

   events: GameContextEvents = new GameContextEvents
   modifiers: object = {}

   computedModifier?: object = undefined
   computedSkills?: ComputedSkills = undefined
   computedAscensionPerks?: ComputedAscensionPerks = undefined

   constructor(ruleSet: CompiledRuleSet) {
      this.ruleSet = ruleSet
   }
}
