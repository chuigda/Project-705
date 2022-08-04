import { Skill } from './skill'

export class CompiledRuleSet {
   skillCategories: string[]
   activityCategories: string[]

   events: { [key: string]: Event }
   modifiers: object // TODO(chuigda): modifier system rework
   skills: { [key: string]: Skill }
}
