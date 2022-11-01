/* eslint-disable import/no-named-as-default-member */

import { Ident, MaybeTranslationKey, Scope } from '@app/base/uid'
import {
   AscensionPerk,
   BubbleMessageTemplate,
   Button,
   MaybeInlineEvent,
   Menu,
   PotentialExpression,
   PropertyOp,
   SimpleDialogTemplate,
   Skill,
   SkillCategoryId,
   SkillCost,
   SkillPotential,
   StoreItemKind,
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
import scopeFunctions from '@app/executor/game_context/scope'
import connectFunctions, { Signal } from '@app/executor/connect'
import eventFunctions from '@app/executor/events'
import grantFunctions from '@app/executor/skill'
import propertyFunctions from '@app/executor/property'
import variableFunctions from '@app/executor/variable'
import uiFunctions, { BubbleMessage, SimpleDialog } from '@app/executor/ui'
import ascensionPerkFunctions from '@app/executor/ascension_perk'
import modifierFunctions from '@app/executor/modifier'
import storeItemFunctions from '@app/executor/store_item'
import activityFunctions from '@app/executor/activity'
import { QResult } from '@app/executor/result'
import { GeneratedSite } from '@app/executor/map_site'

import { PlayerProperty, PlayerStatus, PropertyId } from '@app/executor/game_context/player'
import { ShopStatus } from '@app/executor/game_context/shop'
import { EventHooks } from '@app/executor/game_context/event_hook'

export * from '@app/executor/game_context/event_hook'
export * from '@app/executor/game_context/player'
export * from '@app/executor/game_context/shop'

export class MapStatus {
   rootSite: GeneratedSite
}

export class GameState {
   startup: string = ''

   turns: number = 0
   player: PlayerStatus = new PlayerStatus()
   shop: ShopStatus = new ShopStatus()

   events: EventHooks = new EventHooks()
   modifiers: Set<string> = new Set()
   variables: Record<string, any> = {}

   computedModifier: ComputedModifier = new ComputedModifier()
   computedSkills: ComputedSkills = new ComputedSkills()
   computedAscensionPerks: ComputedAscensionPerks = new ComputedAscensionPerks()

   map: MapStatus = new MapStatus()

   customButtons: Button[] = []
   customMenus: Menu[] = []

   dialogs: SimpleDialog[] = []
   bubbleMessages: BubbleMessage[] = []
}

export class PlayerStatusUpdateTracker {
   properties: boolean = false

   skills: boolean = false
   activities: boolean = false
   ascensionPerks: boolean = false
   ascensionPerkSlots: boolean = false
   items: boolean = false

   any(): boolean {
      return this.properties
         || this.skills
         || this.activities
         || this.ascensionPerks
         || this.ascensionPerkSlots
         || this.items
   }
}

export class UpdateTracker {
   player: PlayerStatusUpdateTracker = new PlayerStatusUpdateTracker()
   shop: boolean = false

   modifiers: boolean = false
   variables: boolean = false

   computedModifiers: boolean = false
   computedSkills: boolean = false
   computedAscensionPerks: boolean = false

   map: boolean = false

   customButtons: boolean
   customMenus: boolean
   customScoreBoards: boolean

   dialogs: boolean
   bubbleMessages: boolean

   reset(): void {
      this.player = new PlayerStatusUpdateTracker()
      this.shop = false

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

   pushScope(scope: Scope) {
      scopeFunctions.pushScope(this, scope)
   }

   popScope() {
      scopeFunctions.popScope(this)
   }

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

   triggerEvent(event: MaybeInlineEvent, ...args: any[]): QResult {
      return eventFunctions.triggerEvent(this, event, ...args)
   }

   addModifier(modifier: Ident): QResult {
      return modifierFunctions.addModifier(this, modifier)
   }

   removeModifier(modifier: Ident): QResult {
      return modifierFunctions.removeModifier(this, modifier)
   }

   grantSkill(skill: Ident, force?: boolean): QResult {
      return grantFunctions.grantSkill(this, skill, force)
   }

   addActivity(activity: Ident): QResult {
      return activityFunctions.addActivity(this, activity)
   }

   addAscensionPerkSlot(count: number): QResult {
      return ascensionPerkFunctions.addAscensionPerkSlot(this, count)
   }

   activateAscensionPerk(ascensionPerk: Ident, force?: boolean): QResult {
      return ascensionPerkFunctions.activateAscensionPerk(this, ascensionPerk, force)
   }

   giveConsumableItem(itemId: Ident, count?: number) {
      storeItemFunctions.giveConsumableItem(this, itemId, count)
   }

   giveRechargeableItem(itemId: Ident, chargeLevel?: number) {
      storeItemFunctions.giveRechargeableItem(this, itemId, chargeLevel)
   }

   giveActiveRelicItem(itemId: Ident) {
      storeItemFunctions.giveActiveRelicItem(this, itemId)
   }

   givePassiveRelicItem(itemId: Ident) {
      storeItemFunctions.givePassiveRelicItem(this, itemId)
   }

   giveTradableItem(itemId: Ident, count?: number) {
      storeItemFunctions.giveTradableItem(this, itemId, count)
   }

   rechargeItem(itemId: Ident, chargeLevel?: number) {
      storeItemFunctions.rechargeItem(this, itemId, chargeLevel)
   }

   addItemToShop(itemId: Ident, kind: StoreItemKind, count?: number) {
      storeItemFunctions.addItemToShop(this, itemId, kind, count)
   }

   removeItemFromShop(itemId: Ident, kind: StoreItemKind) {
      storeItemFunctions.removeItemFromShop(this, itemId, kind)
   }

   initPropertySimple(propertyId: PropertyId, propertyName: MaybeTranslationKey, property: number): PlayerProperty {
      return propertyFunctions.initPropertySimple(this, propertyId, propertyName, property)
   }

   initProperty(propertyId: PropertyId, property: PlayerProperty): PlayerProperty {
      return propertyFunctions.initProperty(this, propertyId, property)
   }

   getProperty(property: PropertyId): PlayerProperty | undefined {
      return propertyFunctions.getProperty(this, property)
   }

   getPropertyValue(property: PropertyId): number | undefined {
      return propertyFunctions.getPropertyValue(this, property)
   }

   updateProperty(property: PropertyId, operator: PropertyOp, value: number, source?: ValueSource) {
      propertyFunctions.updateProperty(this, property, operator, value, source)
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
