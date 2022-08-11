/* eslint-disable import/no-named-as-default-member */

import { Ident, Scope } from '@app/base/uid'
import { Skill, SkillCost, SkillPotential } from '@app/ruleset/items/skill'
import { Activity } from '@app/ruleset/items/activity'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { CompiledRuleSet } from '@app/loader'
import { PotentialExpression } from '@app/ruleset/items/potential'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { PropertyOp } from '@app/ruleset/ops'

import computeFunctions, {
   ComputedAscensionPerks, ComputedSkills, PotentialResult, SkillPotentialResult
} from '@app/executor/compute'
import connectFunctions, { Signal } from '@app/executor/connect'
import eventFunctions from '@app/executor/events'
import grantFunctions from '@app/executor/grant'
import propertyFunctions from '@app/executor/properties'
import variableFunctions from '@app/executor/variables'

export class PlayerAttributes {
   strength: number = 0
   intelligence: number = 0
   emotionalIntelligence: number = 0
   memorization: number = 0
   imagination: number = 0
   charisma: number = 0
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
   variables: Record<string, any> = {}

   computedModifier?: object = undefined
   computedSkills?: ComputedSkills = undefined
   computedAscensionPerks?: ComputedAscensionPerks = undefined

   eventChainCounter?: number = undefined

   constructor(ruleSet: CompiledRuleSet) {
      this.ruleSet = ruleSet
   }

   // ----------------------------------------------------------------------------------------------
   // functions exported for ruleset uses
   // ----------------------------------------------------------------------------------------------

   computePotential(potential: PotentialExpression): PotentialResult {
      return computeFunctions.computePotential(this, potential)
   }

   computeSkillPotential(skillPotential: SkillPotential): SkillPotentialResult {
      return computeFunctions.computeSkillPotential(this, skillPotential)
   }

   computeSkillCost(skillCost: SkillCost): number {
      return computeFunctions.computeSkillCost(this, skillCost)
   }

   recomputeSkillCosts(): void {
      computeFunctions.recomputeSkillCosts(this)
   }

   get signals(): Record<string, (arg?: any) => object> {
      return connectFunctions.signals
   }

   connect(gameContext: GameContext, signal: Signal, event: Ident) {
      connectFunctions.connect(gameContext, signal, event)
   }

   disconnect(gameContext: GameContext, signal: Signal, event: Ident) {
      connectFunctions.disconnect(gameContext, signal, event)
   }

   triggerEvent(event: MaybeInlineEvent, ...args: any[]) {
      eventFunctions.triggerEvent(this, event, ...args)
   }

   learnSkill(skill: Ident) {
      grantFunctions.learnSkill(this, skill)
   }

   grantSkill(skill: Ident) {
      grantFunctions.grantSkill(this, skill)
   }

   updatePlayerProperty(property: string, operator: PropertyOp, value: number, source?: Ident) {
      propertyFunctions.updatePlayerProperty(this, property, operator, value, source)
   }

   getV(varName: Ident): any {
      return variableFunctions.getVar(this, varName)
   }

   setV(varName: Ident, value: any) {
      variableFunctions.setVar(this, varName, value)
   }
}
