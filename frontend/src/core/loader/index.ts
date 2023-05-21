import {
   RuleSet,
   Modifier,
   SkillCategory,
   Scope,
   ConsumableItem,
   PassiveRelicItem,
   RechargeableItem,
   ActiveRelicItem,
   TradableItem,
   MapSite,
} from '@app/core/ruleset'
import { Event, MaybeInlineEvent } from '@app/core/ruleset/items/event'
import { Skill } from '@app/core/ruleset/items/skill'
import { AscensionPerk } from '@app/core/ruleset/items/ascension_perk'
import { Activity } from '@app/core/ruleset/items/activity'
import { Startup } from '@app/core/ruleset/items/startup'
import { compileRuleSet } from '@app/core/loader/blending'

import coreRuleSet from '@rulesets/core_ruleset'
import debugRuleSet from '@rulesets/debug_ruleset'


export type Translation = Record<string, string>

export class CompiledStoreItems {
   consumableItems: Record<string, ConsumableItem> = {}
   rechargeableItems: Record<string, RechargeableItem> = {}
   activeRelicItems: Record<string, ActiveRelicItem> = {}
   passiveRelicItems: Record<string, PassiveRelicItem> = {}
   tradableItems: Record<string, TradableItem> = {}
}

export class CompiledRuleSet {
   loadedRuleSets: Scope[] = []
   skillCategories: Record<string, SkillCategory> = {}
   activityCategories: string[] = []

   events: Record<string, Event> = {}
   modifiers: Record<string, Modifier> = {}
   skills: Record<string, Skill> = {}
   activities: Record<string, Activity> = {}
   ascensionPerks: Record<string, AscensionPerk> = {}
   startups: Record<string, Startup> = {}
   mapSites: Record<string, MapSite> = {}
   storeItems: CompiledStoreItems = new CompiledStoreItems()

   translations: Record<string, Translation> = {}

   onRuleSetLoaded: MaybeInlineEvent[] = []
}

export function loadCoreRuleset(): CompiledRuleSet {
   const ret = new CompiledRuleSet()

   compileRuleSet(ret, coreRuleSet)
   compileRuleSet(ret, debugRuleSet)

   return ret
}
