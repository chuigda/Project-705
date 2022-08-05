import { mEventId, Ident, IdMangler, Scope, mTranslationKey, mSkillId, mActivityId, mStartupId, mAscensionPerkId } from 'base/uid'
import { CompiledRuleSet } from 'loader'
import { Activity } from 'ruleset/items/activity'
import { AscensionPerk } from 'ruleset/items/ascension_perk'
import { Event, MaybeInlineEvent } from 'ruleset/items/event'
import { ItemBase } from 'ruleset/items/item_base'
import { PotentialExpression, PotentialExpressionFunctionOp, PotentialExpressionLogicOp } from 'ruleset/items/potential'
import { Skill } from 'ruleset/items/skill'
import { SkillCategory } from 'ruleset/items/skill_category'
import { Startup } from 'ruleset/items/startup'

export function compileSkillCategories(compilation: CompiledRuleSet, skillCategories: SkillCategory[]) {
   for (const category of skillCategories) {
      const { ident } = category
      const maybeExistingCategory = compilation.skillCategories.findIndex(category1 => category1.ident === ident)
      if (maybeExistingCategory !== -1) {
         console.warn(`[W] [compileSkillCategories] skill category '${category}' already exists, overwriting`)
         compilation.skillCategories[maybeExistingCategory] = category
      } else {
         console.info(`[I] [compileSkillCategories] compiled skill category '${ident}'`)
         compilation.skillCategories.push(category)
      }
   }
}

export function compileActivityCategories(compilation: CompiledRuleSet, activityCategories: string[]) {
   for (const category of activityCategories) {
      if (compilation.activityCategories.indexOf(category) !== -1) {
         console.warn(`[W] [compileActivityCategories] activity category '${category}' already exists, skipping`)
      } else {
         console.info(`[I] [compileActivityCategories] compiled activity category '${category}'`)
         compilation.activityCategories.push(category)
      }
   }
}

export function compilePotentialExpression(scope: Scope, potential: PotentialExpression): PotentialExpression {
   if (potential instanceof PotentialExpressionFunctionOp) {
      return new PotentialExpressionFunctionOp(potential.op, mTranslationKey(scope, potential.description))
   } else {
      return new PotentialExpressionLogicOp(
         potential.op,
         potential.arguments.map(argument => compilePotentialExpression(scope, potential))
      )
   }
}

export function compileMaybeInlineEvent(scope: Scope, event: MaybeInlineEvent): MaybeInlineEvent {
   if (event instanceof Function) {
      return event
   } else {
      return mEventId(scope, event)
   }
}

export function compileBase(scope: Scope, item: ItemBase, mangler: IdMangler): [string, string, string] {
   const { ident, name, description } = item
   return [
      mangler(scope, ident),
      mTranslationKey(scope, name),
      mTranslationKey(scope, description)
   ]
}

export function compileSkill(scope: Scope, skill: Skill): Skill {
   const [ident, name, description] = compileBase(scope, skill, mSkillId)
   const potential = skill.potential?.map(potential => {
      if (potential instanceof PotentialExpressionFunctionOp || potential instanceof PotentialExpressionLogicOp) {
         return compilePotentialExpression(scope, potential)
      } else {
         return mSkillId(scope, potential)
      }
   })
   const activities = skill.activities?.map(activity => mActivityId(scope, activity))
   const events = skill.events?.map(event => compileMaybeInlineEvent(scope, event))

   const { cost, patch } = skill
   return new Skill(
      ident,
      name,
      description,
      cost,
      { potential, activities, events, scope, patch }
   )
}

export function compileStartup(scope: Scope, startup: Startup): Startup {
   const [ident, name, description] = compileBase(scope, startup, mStartupId)
   
   const events = startup.events?.map(event => compileMaybeInlineEvent(scope, event))

   const { patch, player, modifier } = startup
   return new Startup(
      ident,
      name,
      description,
      {
         player,
         modifier,
         events,

         scope,
         patch
      }
   )
}

export function compileActivity(scope: Scope, activity: Activity): Activity {
   const [ident, name, description] = compileBase(scope, activity, mActivityId)
   
   const events = activity.events?.map(event => compileMaybeInlineEvent(scope, event))

   const { category, level, output, patch } = activity
   return new Activity(
      ident,
      name,
      description,

      category,
      level,
   
      {
         events,
         output,

         scope,
         patch
      }
   )
}

export function compileAscensionPerk(scope: Scope, ascensionPerk: AscensionPerk): AscensionPerk {
   const [ident, name, description] = compileBase(scope, ascensionPerk, mAscensionPerkId)

   const potential = ascensionPerk.potential?.map(potential => compilePotentialExpression(scope, potential))
   const events = ascensionPerk.events?.map(event => compileMaybeInlineEvent(scope, event))

   const { modifier, patch } = ascensionPerk
   return new AscensionPerk(
      ident,
      name,
      description,

      {
         potential,
         modifier,
         events,

         scope,
         patch
      }
   )
}

export function compileEvent(scope: Scope, event: Event): Event {
   const ident = mEventId(scope, event.ident)

   return new Event(ident, event.event)
}

export function compileTranslations(scope: Scope, translations: Record<string, string>): Record<string, string> {
   const ret: Record<string, string> = {}
   for (const key in translations) {
      const compiledKey = mTranslationKey(scope, key)
      ret[compiledKey] = translations[key]
   }
   return ret
}
