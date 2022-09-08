import { MaybeTranslationKey, Scope } from '@app/base/uid'
import { ActivityCategoryId, SkillCategory } from '@app/ruleset/items/category'
import { Skill } from '@app/ruleset/items/skill'
import { Startup } from '@app/ruleset/items/startup'
import { Activity } from '@app/ruleset/items/activity'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { Event, MaybeInlineEvent } from '@app/ruleset/items/event'
import { CustomUI } from '@app/ruleset/items/ui'
import { Modifier } from '@app/ruleset/items/modifier'

export * from '@app/base/uid'
export * from '@app/ruleset/items/category'
export * from '@app/ruleset/items/skill'
export * from '@app/ruleset/items/startup'
export * from '@app/ruleset/items/modifier'
export * from '@app/ruleset/items/activity'
export * from '@app/ruleset/items/ascension_perk'
export * from '@app/ruleset/items/event'

export interface RuleSet {
   readonly ident: Scope
   readonly description?: MaybeTranslationKey

   readonly skillCategories?: SkillCategory[]
   readonly activityCategories?: ActivityCategoryId[]
   readonly skills?: Skill[]
   readonly startups?: Startup[]
   readonly modifiers?: Modifier[]
   readonly activities?: Activity[]
   readonly ascensionPerks?: AscensionPerk[]
   readonly events?: Event[]
   readonly translations?: Record<string, Record<string, string>>
   readonly ui?: CustomUI

   readonly onRuleSetLoaded?: MaybeInlineEvent[]
}
