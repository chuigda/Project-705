/* eslint-disable import/no-named-as-default-member */

import { Ident, MaybeTranslationKey, Scope } from '@app/base/uid'
import {
   AscensionPerk,
   BubbleMessageTemplate,
   MaybeInlineEvent,
   PotentialExpression,
   PropertyOp,
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

/// 游戏地图状态
export class MapStatus {
   /// 地图根节点，也就是玩家当前所处的节点
   rootSite: GeneratedSite
}

/// 游戏状态
///
/// **注意：**在编写 mod/dlc 时，应该尽量使用 `GameContext` 中提供的函数，而非直接操作 `GameState` 中的字段。
export class GameState {
   /// 玩家选择的起源
   startup: string = ''

   /// 当前回合数
   turns: number = 0

   /// 玩家状态
   player: PlayerStatus = new PlayerStatus()

   /// 商店状态
   shop: ShopStatus = new ShopStatus()

   /// 事件钩子
   events: EventHooks = new EventHooks()

   /// 玩家获得的静态修正
   modifiers: Set<string> = new Set()

   /// 变量表
   variables: Record<string, any> = {}

   /// 经过计算的静态修正
   computedModifier: ComputedModifier = new ComputedModifier()

   /// 经过计算的可学习/不可学习技能列表
   computedSkills: ComputedSkills = new ComputedSkills()

   /// 经过计算的可用/不可用飞升项目列表
   computedAscensionPerks: ComputedAscensionPerks = new ComputedAscensionPerks()

   /// 地图状态
   map: MapStatus = new MapStatus()

   /// 对话框
   dialogs: Record<string, SimpleDialog> = {}

   /// 气泡消息列表
   bubbleMessages: BubbleMessage[] = []
}

/// 玩家状态更新追踪器
///
/// 用于追踪 `PlayerStatus` 的更新状况，从而选择性地将有更新的内容发送给前端。
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

/// 游戏状态更新追踪器
///
/// 用于追踪 `GameState` 的更新状况，从而选择性地将有更新的内容发送给前端。
export class UpdateTracker {
   player: PlayerStatusUpdateTracker = new PlayerStatusUpdateTracker()
   shop: boolean = false

   modifiers: boolean = false
   variables: boolean = false

   computedModifiers: boolean = false
   computedSkills: boolean = false
   computedAscensionPerks: boolean = false

   map: boolean = false
   bubbleMessages: boolean

   reset(): void {
      this.player = new PlayerStatusUpdateTracker()
      this.shop = false

      this.modifiers = false
      this.variables = false

      this.computedModifiers = false
      this.computedSkills = false
      this.computedAscensionPerks = false

      this.map = false
      this.bubbleMessages = false
   }
}

/// 游戏上下文
export class GameContext {
   /// 进行游戏时加载的规则集
   readonly ruleSet: CompiledRuleSet

   /// 游戏状态
   state: GameState = new GameState()

   /// 更新追踪器
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
   // 供 mod/dlc 使用的公开函数
   // ----------------------------------------------------------------------------------------------

   /// 压入一个作用域
   public pushScope(scope: Scope) {
      scopeFunctions.pushScope(this, scope)
   }

   /// 推出最后压入的作用域
   public popScope() {
      scopeFunctions.popScope(this)
   }

   /// 计算需求表达式
   public computePotential(potential: PotentialExpression): PotentialResult {
      return computeFunctions.computePotential(this, potential)
   }

   /// 计算技能需求表达式
   public computeSkillPotential(skillPotential: SkillPotential): SkillPotentialResult {
      return computeFunctions.computeSkillPotential(this, skillPotential)
   }

   /// 计算学习技能所需的技能点数
   public computeSkillCost(skillCost: SkillCost, skillCategory?: SkillCategoryId): number {
      return computeFunctions.computeSkillCost(this, skillCost, skillCategory)
   }

   /// 重算所有可学习技能消耗的技能点数
   public recomputeSkillCosts(): void {
      computeFunctions.recomputeSkillCosts(this)
   }

   /// 辅助函数，获得所有信号“构造器”
   public get signals(): Record<string, (...args: any) => Signal> {
      return connectFunctions.signals
   }

   /// 将一个信号连接到一个事件
   public connect(signal: Signal, event: Ident) {
      connectFunctions.connect(this, signal, event)
   }

   /// 断开信号和事件之间的连接
   public disconnect(signal: Signal, event: Ident) {
      connectFunctions.disconnect(this, signal, event)
   }

   /// 触发一个事件
   public triggerEvent(event: MaybeInlineEvent, ...args: any[]): QResult {
      return eventFunctions.triggerEvent(this, event, ...args)
   }

   /// 添加一个静态修正
   public addModifier(modifier: Ident): QResult {
      return modifierFunctions.addModifier(this, modifier)
   }

   /// 移除一个静态修正
   public removeModifier(modifier: Ident): QResult {
      return modifierFunctions.removeModifier(this, modifier)
   }

   /// 获得一个技能，不消耗技能点数
   ///
   /// @parameter force 无论需求（`potential`）是否满足，都强制获得这个技能
   public grantSkill(skill: Ident, force?: boolean): QResult {
      return grantFunctions.grantSkill(this, skill, force)
   }

   /// 获得一项活动
   public addActivity(activity: Ident): QResult {
      return activityFunctions.addActivity(this, activity)
   }

   /// 增加飞升槽
   public addAscensionPerkSlot(count: number): QResult {
      return ascensionPerkFunctions.addAscensionPerkSlot(this, count)
   }

   /// 激活一个飞升
   ///
   /// @parameter force 无论需求（`potential`）是否满足，都强制激活这个飞升
   public activateAscensionPerk(ascensionPerk: Ident, force?: boolean): QResult {
      return ascensionPerkFunctions.activateAscensionPerk(this, ascensionPerk, force)
   }

   /// 获得消耗品
   public giveConsumableItem(itemId: Ident, count?: number) {
      storeItemFunctions.giveConsumableItem(this, itemId, count)
   }

   /// 获得可充能物品
   public giveRechargeableItem(itemId: Ident, chargeLevel?: number) {
      storeItemFunctions.giveRechargeableItem(this, itemId, chargeLevel)
   }

   /// 获得主动技能类物品
   public giveActiveRelicItem(itemId: Ident) {
      storeItemFunctions.giveActiveRelicItem(this, itemId)
   }

   /// 获得被动型物品
   public givePassiveRelicItem(itemId: Ident) {
      storeItemFunctions.givePassiveRelicItem(this, itemId)
   }

   /// 获得可交易物品
   public giveTradableItem(itemId: Ident, count?: number) {
      storeItemFunctions.giveTradableItem(this, itemId, count)
   }

   /// 为可充能物品充能
   public rechargeItem(itemId: Ident, chargeLevel?: number) {
      storeItemFunctions.rechargeItem(this, itemId, chargeLevel)
   }

   /// 将物品上架到商店
   public addItemToShop(itemId: Ident, kind: StoreItemKind, count?: number) {
      storeItemFunctions.addItemToShop(this, itemId, kind, count)
   }

   /// 从商店下架物品
   public removeItemFromShop(itemId: Ident, kind: StoreItemKind) {
      storeItemFunctions.removeItemFromShop(this, itemId, kind)
   }

   /// 以简单模式初始化一个属性
   ///
   /// 被初始化的属性的当前值（`value`）会被置为参数 `property` 的值，
   /// 最小值（`min`）会被置为 0，不设置最大值（`max`）和回合增量（`incr`）
   public initPropertySimple(
      propertyId: PropertyId,
      propertyName: MaybeTranslationKey,
      property: number
   ): PlayerProperty {
      return propertyFunctions.initPropertySimple(this, propertyId, propertyName, property)
   }

   /// 初始化一个属性
   public initProperty(propertyId: PropertyId, property: PlayerProperty): PlayerProperty {
      return propertyFunctions.initProperty(this, propertyId, property)
   }

   /// 获得一个属性的完整信息
   public getProperty(property: PropertyId): PlayerProperty | undefined {
      return propertyFunctions.getProperty(this, property)
   }

   /// 获得一个属性的当前值（`value`）
   public getPropertyValue(property: PropertyId): number | undefined {
      return propertyFunctions.getPropertyValue(this, property)
   }

   /// 更新一个属性
   public updateProperty(property: PropertyId, operator: PropertyOp, value: number, source?: ValueSource) {
      propertyFunctions.updateProperty(this, property, operator, value, source)
   }

   /// 获得一个变量的值
   public getV(varName: Ident): any {
      return variableFunctions.getVar(this, varName)
   }

   /// 设置一个变量的值
   public setV(varName: Ident, value: any): any {
      return variableFunctions.setVar(this, varName, value)
   }

   /// 更新一个变量的值
   public updateV(varName: Ident, updater: (v: any) => any): any {
      return variableFunctions.updateVar(this, varName, updater)
   }

   /// 创建一个气泡消息
   public createBubbleMessage(template: BubbleMessageTemplate): BubbleMessage {
      return uiFunctions.createBubbleMessage(this, template)
   }

   /// 关闭一个气泡消息
   public closeBubbleMessage(uid: string) {
      return uiFunctions.closeBubbleMessage(this, uid)
   }
}
