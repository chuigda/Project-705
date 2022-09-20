/* eslint-disable import/no-named-as-default-member */

import { Ident, Scope } from '@app/base/uid'
import {
   Activity,
   AscensionPerk,
   BubbleMessageTemplate,
   Button,
   CustomScoreBoard,
   MaybeInlineEvent,
   Menu,
   PotentialExpression,
   PropertyOp,
   SimpleDialogTemplate,
   Skill,
   SkillCategoryId,
   SkillCost,
   SkillPotential,
   StoreItem,
   ValueSource
} from '@app/ruleset'

import { CompiledRuleSet } from '@app/loader'
import computeFunctions, {
   ComputedAscensionPerks,
   ComputedModifier,
   ComputedSkills,
   PotentialResult,
   SkillPotentialResult
} from '@app/executor/compute'
import connectFunctions, { Signal } from '@app/executor/connect'
import eventFunctions from '@app/executor/events'
import grantFunctions from '@app/executor/skill'
import propertyFunctions from '@app/executor/properties'
import variableFunctions from '@app/executor/variables'
import uiFunctions, { BubbleMessage, SimpleDialog } from '@app/executor/ui'
import ascensionPerkFunctions from '@app/executor/ascension_perk'
import activityFunctions from '@app/executor/activity'
import modifierFunctions from '@app/executor/modifier'

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
   ascensionPerkSlots: number = 0
   storeItems: Record<string, StoreItem> = {}

   energy: number = 0
   energyMax: number = 150
   mentalHealth: number = 0
   mentalHealthMax: number = 100
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
   mentalHealth: Set<string> = new Set()
}

export class TimedEvent {
   turn: number
   eventId: string
   trigger: 'turn_start' | 'turn_over'
}

export class GameContextEvents {
   turnStart: Set<string> = new Set()
   turnOver: Set<string> = new Set()
   playerPropertyUpdated: PlayerPropertyUpdatedEvents = new PlayerPropertyUpdatedEvents()
   skillLearnt: Record<string, Set<string>> = {}
   activityPerformed: Record<string, Set<string>> = {}
   eventsTriggered: Record<string, Set<string>> = {}

   timedEvents: TimedEvent[] = []
}

export class GameState {
   startup: string = ''

   turns: number = 0
   player: PlayerStatus = new PlayerStatus()

   events: GameContextEvents = new GameContextEvents()
   modifiers: Set<string> = new Set()
   variables: Record<string, any> = {}

   computedModifier?: ComputedModifier = undefined
   computedSkills?: ComputedSkills = undefined
   computedAscensionPerks?: ComputedAscensionPerks = undefined

   customButtons: Button[] = []
   customMenus: Menu[] = []
   customScoreBoards: CustomScoreBoard[] = []

   dialogs: SimpleDialog[] = []
   bubbleMessages: BubbleMessage[] = []
}

export class PlayerStatusUpdateTracker {
   properties: boolean = false

   skills: boolean = false
   activities: boolean = false
   ascensionPerks: boolean = false
   ascensionPerkSlots: boolean = false

   any(): boolean {
      return this.properties
         || this.skills
         || this.activities
         || this.ascensionPerks
         || this.ascensionPerkSlots
   }
}

export class UpdateTracker {
   player: PlayerStatusUpdateTracker = new PlayerStatusUpdateTracker()

   modifiers: boolean = false
   variables: boolean = false

   computedModifiers: boolean = false
   computedSkills: boolean = false
   computedAscensionPerks: boolean = false

   customButtons: boolean
   customMenus: boolean
   customScoreBoards: boolean

   dialogs: boolean
   bubbleMessages: boolean

   reset(): void {
      this.player = new PlayerStatusUpdateTracker()

      this.modifiers = false
      this.variables = false

      this.computedModifiers = false
      this.computedSkills = false
      this.computedAscensionPerks = false

      this.customButtons = false
      this.customMenus = false
      this.customScoreBoards = false

      this.dialogs = false
      this.bubbleMessages = false
   }
}

export class GameContext {
   readonly ruleSet: CompiledRuleSet
   state: GameState = new GameState()

   updateTracker: UpdateTracker = new UpdateTracker()
   scope?: Scope = undefined
   scopeChain: Scope[] = []
   eventChainCounter?: number = undefined
   uiItemCounter: number = 0

   skillPool: Record<string, Skill> = {}
   ascensionPerkPool: Record<string, AscensionPerk> = {}

   constructor(ruleSet: CompiledRuleSet) {
      this.ruleSet = ruleSet
      Object.assign(this.skillPool, ruleSet.skills)
      Object.assign(this.ascensionPerkPool, ruleSet.ascensionPerks)
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

   computeSkillCost(skillCost: SkillCost, skillCategory?: SkillCategoryId): number {
      return computeFunctions.computeSkillCost(this, skillCost, skillCategory)
   }

   recomputeSkillCosts(): void {
      computeFunctions.recomputeSkillCosts(this)
   }

   get signals(): Record<string, (...args: any) => Signal> {
      return connectFunctions.signals
   }

   connect(signal: Signal, event: Ident) {
      connectFunctions.connect(this, signal, event)
   }

   disconnect(signal: Signal, event: Ident) {
      connectFunctions.disconnect(this, signal, event)
   }

   triggerEvent(event: MaybeInlineEvent, ...args: any[]) {
      eventFunctions.triggerEvent(this, event, ...args)
   }

   addModifier(modifier: Ident) {
      modifierFunctions.addModifier(this, modifier)
   }

   removeModifier(modifier: Ident) {
      modifierFunctions.removeModifier(this, modifier)
   }

   learnSkill(skill: Ident) {
      grantFunctions.learnSkill(this, skill)
   }

   grantSkill(skill: Ident) {
      grantFunctions.grantSkill(this, skill)
   }

   addAscensionPerkSlot(count: number) {
      ascensionPerkFunctions.addAscensionPerkSlot(this, count)
   }

   activateAscensionPerk(ascensionPerk: Ident) {
      ascensionPerkFunctions.activateAscensionPerk(this, ascensionPerk)
   }

   performActivity(activity: Ident) {
      activityFunctions.performActivity(this, activity)
   }

   updatePlayerProperty(property: string, operator: PropertyOp, value: number, source?: ValueSource) {
      propertyFunctions.updatePlayerProperty(this, property, operator, value, source)
   }

   getV(varName: Ident): any {
      return variableFunctions.getVar(this, varName)
   }

   setV(varName: Ident, value: any): any {
      return variableFunctions.setVar(this, varName, value)
   }

   updateV(varName: Ident, updater: (v: any) => any): any {
      return variableFunctions.updateVar(this, varName, updater)
   }

   createDialog(template: Ident | SimpleDialogTemplate): SimpleDialog | null {
      return uiFunctions.createDialog(this, template)
   }

   createBubbleMessage(template: Ident | BubbleMessageTemplate): BubbleMessage | null {
      return uiFunctions.createBubbleMessage(this, template)
   }
}
