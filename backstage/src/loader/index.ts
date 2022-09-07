import { SkillCategory } from '@app/ruleset/items/skill_category'
import { RuleSet } from '@app/ruleset'
import { typeAssert } from '@app/util/type_assert'
import { ruleSetAssertion } from '@app/loader/assertions'
import { Event, MaybeInlineEvent } from '@app/ruleset/items/event'
import { Skill } from '@app/ruleset/items/skill'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { Activity } from '@app/ruleset/items/activity'
import { Startup } from '@app/ruleset/items/startup'
import { CompiledCustomUI, compileRuleSet } from '@app/loader/blending'
import { abort } from '@app/util/emergency'

import coreRuleSet from '@rulesets/core_ruleset'
import debugRuleSet from '@rulesets/debug_ruleset'

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

export class CompiledRuleSet {
   skillCategories: SkillCategory[] = []
   activityCategories: string[] = []

   events: Record<string, Event> = {}
   modifiers: object = {} // TODO(chuigda): modifier system rework
   skills: Record<string, Skill> = {}
   activities: Record<string, Activity> = {}
   ascensionPerks: Record<string, AscensionPerk> = {}
   startups: Record<string, Startup> = {}
   ui: CompiledCustomUI = new CompiledCustomUI()

   translations: Record<string, Translation> = {}

   onRuleSetLoaded: MaybeInlineEvent[] = []
}

export function load(): CompiledRuleSet {
   const ret = new CompiledRuleSet()

   if (process.env.SKIP_CORE_RULESET !== '1') {
      try {
         console.info('[I] [load] loading core ruleset')
         compileRuleSet(ret, coreRuleSet)
         if (process.env.DEBUG === '1') {
            console.info('[I] [load] debug mode enabled, also loading debug ruleset')
            compileRuleSet(ret, debugRuleSet)
         }
      } catch (e) {
         console.error(`[E] [load] error compiling core ruleset: ${e}\n${e.stack}`)
         abort()
      }
   }

   const modList = require(`${process.cwd()}/mods/mods.json`)
   for (const modName of modList) {
      const [mod, err] = loadDynamicMod(modName)
      if (err) {
         console.error(`[E] [load] error loading mod '${modName}': ${err}\n${err.stack}`)
         continue
      }

      try {
         compileRuleSet(ret, mod!)
      } catch (e) {
         console.error(`[E] [load] error compiling mod '${modName}': ${e}\n${e.stack}`)
         abort()
      }
   }

   return Object.freeze(ret)
}
