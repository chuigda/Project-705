import { MaybeTranslationKey, Scope } from '@app/core/base/uid'
import { Skill } from '@app/core/ruleset/items/skill'
import { Startup } from '@app/core/ruleset/items/startup'
import { Activity } from '@app/core/ruleset/items/activity'
import { AscensionPerk } from '@app/core/ruleset/items/ascension_perk'
import { Event, MaybeInlineEvent } from '@app/core/ruleset/items/event'
import { Modifier } from '@app/core/ruleset/items/modifier'
import { MapSite } from '@app/core/ruleset/items/map_site'
import {
   ActiveRelicItem,
   ConsumableItem,
   PassiveRelicItem,
   RechargeableItem,
   TradableItem
} from '@app/core/ruleset/items/store_item'
import { CompiledRuleSet } from '@app/core/loader'
import {ActivityCategoryId, SkillCategory} from '@app/core/ruleset/items/category'

export * from '@app/core/base/uid'
export * from '@app/core/ruleset/ops'
export * from '@app/core/ruleset/items/category'
export * from '@app/core/ruleset/items/potential'
export * from '@app/core/ruleset/items/skill'
export * from '@app/core/ruleset/items/startup'
export * from '@app/core/ruleset/items/modifier'
export * from '@app/core/ruleset/items/activity'
export * from '@app/core/ruleset/items/ascension_perk'
export * from '@app/core/ruleset/items/store_item'
export * from '@app/core/ruleset/items/event'
export * from '@app/core/ruleset/items/ui'
export * from '@app/core/ruleset/items/map_site'

/// 规则集商店物品列表
export interface RuleSetStoreItems {
   consumableItems?: ConsumableItem[]
   rechargeableItems?: RechargeableItem[]
   activeRelicItems?: ActiveRelicItem[]
   passiveRelicItems?: PassiveRelicItem[]
   tradableItems?: TradableItem[]
}

/// 规则集
export interface RuleSet {
   /// 规则集标识符
   readonly ident: Scope

   /// 规则集名称
   readonly name: MaybeTranslationKey,

   /// 规则集描述文本
   readonly description?: MaybeTranslationKey

   /// 技能类别列表
   readonly skillCategories?: SkillCategory[]

   /// 活动类别列表
   readonly activityCategories?: ActivityCategoryId[]

   /// 可学习技能列表
   readonly skills?: Skill[]

   /// 起源列表
   readonly startups?: Startup[]

   /// 修正列表
   readonly modifiers?: Modifier[]

   /// 活动列表
   readonly activities?: Activity[]

   /// 飞升项目列表
   readonly ascensionPerks?: AscensionPerk[]

   /// 商店物品列表
   readonly storeItems?: RuleSetStoreItems

   /// 地图节点列表
   readonly mapSites?: MapSite[]

   /// 事件列表
   readonly events?: Event[]

   /// 翻译项目列表
   readonly translations?: Record<string, Record<string, string>>

   /// 规则集被加载到 `GameContext` 中时执行的事件列表
   readonly onRuleSetLoaded?: MaybeInlineEvent[]
}

/// 规则集生成函数 (type-A)
export type RuleSetGeneratorA = (compiling: CompiledRuleSet) => RuleSet

/// 规则集生成函数 (type-B)
export type RuleSetGeneratorB = (compiling: CompiledRuleSet) => void

/// 一个模块，要么是一个 `RuleSet`，要么是一个 `RuleSetGenerator`
export type Module =
   RuleSet
   | RuleSetGeneratorA
   | RuleSetGeneratorB
