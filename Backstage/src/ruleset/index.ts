import { Skill } from './items/skill'
import { MaybeTranslationKey, Scope } from '../base/uid'
import { SkillCategory } from './items/skill_category'
import { Startup } from './items/startup'
import { Activity } from './items/activity'
import { AscensionPerk } from './items/ascension_perk'
import { Event, MaybeInlineEvent } from './items/event'

export class RuleSet {
   readonly ident: Scope
   readonly description?: MaybeTranslationKey

   readonly skillCategories?: SkillCategory[]
   readonly activityCategories?: string[]
   readonly skills?: Skill[]
   readonly startups?: Startup[]
   readonly activities?: Activity[]
   readonly ascensionPerks?: AscensionPerk[]
   readonly events: Event[]
   readonly translations: Record<string, string>

   readonly onRuleSetLoaded?: MaybeInlineEvent[]
}
