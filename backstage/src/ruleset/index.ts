import { MaybeTranslationKey, Scope } from '@app/base/uid'
import { ActivityCategoryId, SkillCategory } from '@app/ruleset/items/category'
import { Skill } from '@app/ruleset/items/skill'
import { Startup } from '@app/ruleset/items/startup'
import { Activity } from '@app/ruleset/items/activity'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { Event, MaybeInlineEvent } from '@app/ruleset/items/event'
import { CustomUI } from '@app/ruleset/items/ui'
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

export interface RuleSetStoreItems {
   consumableItems?: ConsumableItem[]
   rechargeableItems?: RechargeableItem[]
   activeRelicItems?: ActiveRelicItem[]
   passiveRelicItems?: PassiveRelicItem[]
   tradableItems?: TradableItem[]
}

export interface RuleSetContent {
   readonly description?: MaybeTranslationKey
   readonly skills?: Skill[]
   readonly startups?: Startup[]
   readonly modifiers?: Modifier[]
   readonly activities?: Activity[]
   readonly ascensionPerks?: AscensionPerk[]
   readonly storeItems?: RuleSetStoreItems
   readonly mapSites?: MapSite[]
   readonly events?: Event[]
   readonly translations?: Record<string, Record<string, string>>
   readonly ui?: CustomUI
   readonly onRuleSetLoaded?: MaybeInlineEvent[]
}

export interface RuleSetDescriptor {
   readonly ident: Scope
   readonly descriptor?: RuleSetDescriptor
   readonly skillCategories?: SkillCategory[]
   readonly activityCategories?: ActivityCategoryId[]
}

export interface RuleSet {
   readonly highOrder?: false
   readonly descriptor: RuleSetDescriptor
   readonly content: RuleSetContent
}

export interface HighOrderRuleset {
   readonly highOrder: true
   readonly descriptor: RuleSetDescriptor
   readonly generator: (ruleSetSummary: RuleSetDescriptor[]) => RuleSetContent
}

export type Module = RuleSet | HighOrderRuleset
