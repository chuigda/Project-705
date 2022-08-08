import { Skill } from '@app/ruleset/items/skill'
import { MaybeTranslationKey, Scope } from '@app/base/uid'
import { SkillCategory } from '@app/ruleset/items/skill_category'
import { Startup } from '@app/ruleset/items/startup'
import { Activity } from '@app/ruleset/items/activity'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { Event, MaybeInlineEvent } from '@app/ruleset/items/event'

export interface RuleSet {
   readonly ident: Scope
   readonly description?: MaybeTranslationKey

   readonly skillCategories?: SkillCategory[]
   readonly activityCategories?: string[]
   readonly skills?: Skill[]
   readonly startups?: Startup[]
   readonly activities?: Activity[]
   readonly ascensionPerks?: AscensionPerk[]
   readonly events?: Event[]
   readonly translations?: Record<string, Record<string, string>>

   readonly onRuleSetLoaded?: MaybeInlineEvent[]
}
