import { MaybeTranslationKey, Scope } from '@app/base/uid'
import { ActivityCategoryId, SkillCategory } from '@app/ruleset/items/category'
import { Skill } from '@app/ruleset/items/skill'
import { Startup } from '@app/ruleset/items/startup'
import { Activity } from '@app/ruleset/items/activity'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { Event, MaybeInlineEvent } from '@app/ruleset/items/event'
import { Modifier } from '@app/ruleset/items/modifier'
import { MapSite } from '@app/ruleset/items/map_site'
import {
   ActiveRelicItem,
   ConsumableItem,
   PassiveRelicItem,
   RechargeableItem,
   TradableItem
} from '@app/ruleset/items/store_item'

export * from '@app/base/uid'
export * from '@app/ruleset/ops'
export * from '@app/ruleset/items/category'
export * from '@app/ruleset/items/potential'
export * from '@app/ruleset/items/skill'
export * from '@app/ruleset/items/startup'
export * from '@app/ruleset/items/modifier'
export * from '@app/ruleset/items/activity'
export * from '@app/ruleset/items/ascension_perk'
export * from '@app/ruleset/items/store_item'
export * from '@app/ruleset/items/event'
export * from '@app/ruleset/items/ui'
export * from '@app/ruleset/items/map_site'

/// 规则集商店物品列表
export interface RuleSetStoreItems {
   consumableItems?: ConsumableItem[]
   rechargeableItems?: RechargeableItem[]
   activeRelicItems?: ActiveRelicItem[]
   passiveRelicItems?: PassiveRelicItem[]
   tradableItems?: TradableItem[]
}

/// 规则集内容
export interface RuleSetContent {
   /// 规则集名称
   readonly name?: MaybeTranslationKey,

   /// 规则集描述文本
   readonly description?: MaybeTranslationKey

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

/// 规则集描述符
export interface RuleSetDescriptor {
   /// 规则集的标识符
   ///
   /// 这个标识符会被用于区分不同的规则集合，以及对规则集内部的对象 ID 进行名称重整
   readonly ident: Scope

   /// 规则集提供的可学习技能类别列表
   readonly skillCategories?: SkillCategory[]

   /// 规则集提供的活动类别列表
   readonly activityCategories?: ActivityCategoryId[]
}

/// 常规的规则集，所有内容包含于规则集内部
export interface RuleSet {
   readonly highOrder?: false
   readonly descriptor: RuleSetDescriptor
   readonly content: RuleSetContent
}

/// “高阶” 规则集，提供一个生成函数，读取所有已加载规则集的描述符，动态地生成 `RuleSetContent`
export interface HighOrderRuleset {
   readonly highOrder: true
   readonly descriptor: RuleSetDescriptor

   /// 生成函数，接受一系列 `RuleSetDescriptor` 并生成 `RuleSetContent`
   readonly generator: (ruleSetSummary: RuleSetDescriptor[]) => RuleSetContent
}

/// 一个模块，要么是一个 `RuleSet`，要么是一个 `HighOrderRuleset`
export type Module = RuleSet | HighOrderRuleset
