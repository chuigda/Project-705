import { SkillCategory } from '@app/ruleset/items/skill_category'
import { RuleSet } from '@app/ruleset'
import { typeAssert } from '@app/util/type_assert'
import { ruleSetAssertion } from '@app/loader/assertions'
import { Event, MaybeInlineEvent } from '@app/ruleset/items/event'
import { Skill } from '@app/ruleset/items/skill'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { Activity } from '@app/ruleset/items/activity'
import { Startup } from '@app/ruleset/items/startup'

export function loadDynamicMod(modName: string): [RuleSet | null, any] {
   try {
      const mod = require(`./mods/${modName}`)
      typeAssert(mod, ruleSetAssertion)
      return [mod as RuleSet, null]
   } catch (e) {
      return [null, e]
   }
}

export class CompiledRuleSet {
   skillCategories: SkillCategory[] = []
   activityCategories: string[] = []

   events: Record<string, Event> = {}
   modifiers: object // TODO(chuigda): modifier system rework = {}
   skills: Record<string, Skill> = {}
   activities: Record<string, Activity> = {}
   ascensionPerks: Record<string, AscensionPerk> = {}
   startups: Record<string, Startup> = {}

   translations: Record<string, Record<string, string>> = {}

   onRuleSetLoaded: MaybeInlineEvent[] = []
}
