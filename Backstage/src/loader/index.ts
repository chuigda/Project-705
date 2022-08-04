import { RuleSet } from '../ruleset'
import { typeAssert } from '../util/type_assert'
import { ruleSetAssertion } from './assertions'
import { Event } from '../ruleset/items/event'
import { Skill } from '../ruleset/items/skill'

export function loadDynamicMod(modName: string): [RuleSet, any] {
   try {
      const mod = require(`./mods/${modName}`)
      typeAssert(mod, ruleSetAssertion)
      return [mod as RuleSet, null]
   } catch (e) {
      return [null, e]
   }
}

export class CompiledRuleSet {
   skillCategories: string[]
   activityCategories: string[]

   events: { [key: string]: Event }
   modifiers: object // TODO(chuigda): modifier system rework
   skills: { [key: string]: Skill }
}
