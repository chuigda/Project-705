import {
   RuleSet,
   Modifier,
   SkillCategory,
   Scope,
   StoreItem,
   ConsumableItem,
   PassiveRelicItem,
   RechargeableItem, ActiveRelicItem, TradableItem
} from '@app/ruleset'
import { typeAssert } from '@app/util/type_assert'
import { ruleSetAssertion } from '@app/loader/assertions'
import { Event, MaybeInlineEvent } from '@app/ruleset/items/event'
import { Skill } from '@app/ruleset/items/skill'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { Activity } from '@app/ruleset/items/activity'
import { Startup } from '@app/ruleset/items/startup'
import { compileRuleSet, preCompileRuleSet } from '@app/loader/blending'
import { abort } from '@app/util/emergency'

import coreRuleSet from '@rulesets/core_ruleset'
import debugRuleSet from '@rulesets/debug_ruleset'
import {
   BubbleMessageTemplate,
   Button,
   CustomScoreBoard,
   Menu,
   SimpleDialogTemplate
} from '@app/ruleset/items/ui'

export function loadDynamicMod(modName: string): [RuleSet | null, any] {
   try {
      const mod = require(`${process.cwd()}/mods/${modName}`)

      typeAssert(mod, ruleSetAssertion)
      return [mod as RuleSet, null]
   } catch (e) {
      return [null, e]
   }
}

export type Translation = Record<string, string>

export class CompiledStoreItems {
   consumableItems: Record<string, ConsumableItem> = {}
   rechargeableItems: Record<string, RechargeableItem> = {}
   activeRelicItems: Record<string, ActiveRelicItem> = {}
   passiveRelicItems: Record<string, PassiveRelicItem> = {}
   tradableItems: Record<string, TradableItem> = {}
}

export class CompiledCustomUI {
   menus: Record<string, Menu> = {}
   buttons: Record<string, Button> = {}
   scoreBoards: Record<string, CustomScoreBoard> = {}

   dialogTemplates: Record<string, SimpleDialogTemplate> = {}
   bubbleMessageTemplates: Record<string, BubbleMessageTemplate> = {}
}

export class CompiledRuleSet {
   loadedRuleSets: Scope[] = []
   skillCategories: SkillCategory[] = []
   activityCategories: string[] = []

   events: Record<string, Event> = {}
   modifiers: Record<string, Modifier> = {}
   skills: Record<string, Skill> = {}
   activities: Record<string, Activity> = {}
   ascensionPerks: Record<string, AscensionPerk> = {}
   startups: Record<string, Startup> = {}
   storeItems: CompiledStoreItems = new CompiledStoreItems()
   ui: CompiledCustomUI = new CompiledCustomUI()

   translations: Record<string, Translation> = {}

   onRuleSetLoaded: MaybeInlineEvent[] = []
}

export function load(): CompiledRuleSet {
   const ret = new CompiledRuleSet()
   const modList: string[] = require(`${process.cwd()}/mods/mods.json`)

   let mods: RuleSet[]
   try {
      mods = modList.map((modName: string) => {
         const [mod, err] = loadDynamicMod(modName)
         if (err) {
            console.error(`[E] [load] error loading mod '${modName}': ${err}\n${err.stack}`)
            throw err
         }
         return mod!
      })
   } catch (e) {
      abort()
   }

   // precompile: load all skill categories and activity categories for further use

   if (process.env.SKIP_CORE_RULESET !== '1') {
      console.info('[I] [load] pre-compiling core ruleset')
      preCompileRuleSet(ret, coreRuleSet)
   }

   if (process.env.DEBUG === '1') {
      console.info('[I] [load] pre-compiling debug ruleset')
      preCompileRuleSet(ret, debugRuleSet)
   }

   for (const idx in modList) {
      const modName = modList[idx]
      const mod = mods[idx]

      console.info(`[I] [load] pre-compiling mod '${modName}'`)
      preCompileRuleSet(ret, mod)
   }

   // compile: actually instantiate all things required

   if (process.env.SKIP_CORE_RULESET !== '1') {
      console.info('[I] [load] loading core ruleset')
      try {
         compileRuleSet(ret, coreRuleSet)
      } catch (e) {
         console.error(`[E] [load] error compiling core ruleset: ${e}\n${e.stack}`)
         abort()
      }
   }

   if (process.env.DEBUG === '1') {
      console.info('[I] [load] debug mode enabled, also loading debug ruleset')
      try {
         compileRuleSet(ret, debugRuleSet)
      } catch (e) {
         console.error(`[E] [load] error compiling debug ruleset: ${e}\n${e.stack}`)
         abort()
      }
   }

   for (const idx in modList) {
      const modName = modList[idx]
      const mod = mods[idx]

      try {
         console.info(`[I] [load] compiling mod '${modName}'`)
         compileRuleSet(ret, mod!)
      } catch (e) {
         console.error(`[E] [load] error compiling mod '${modName}': ${e}\n${e.stack}`)
         abort()
      }
   }

   return Object.freeze(ret)
}
