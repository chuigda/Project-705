import {
   IdMangler, Scope,
   mEventId, mTranslationKey, mSkillId, mActivityId, mStartupId, mAscensionPerkId
} from '../base/uid'
import { AscensionPerk } from '../ruleset/items/ascension_perk'
import { Event, MaybeInlineEvent } from '../ruleset/items/event'
import { ItemBase } from '../ruleset/items/item_base'
import {
   PotentialExpression,
   PotentialExpressionFunctionOp,
   PotentialExpressionLogicOp
} from '../ruleset/items/potential'
import { Skill } from '../ruleset/items/skill'
import { Startup } from '../ruleset/items/startup'
import { Activity } from '../ruleset/items/activity'

export function compilePotentialExpression(scope: Scope, potential: PotentialExpression): PotentialExpression {
   if (potential.op instanceof Function) {
      return new PotentialExpressionFunctionOp(
         potential.op,
         mTranslationKey(scope, (<PotentialExpressionFunctionOp>potential).description)
      )
   } else {
      return new PotentialExpressionLogicOp(
         potential.op,
         (<PotentialExpressionLogicOp>potential).arguments.map(argument => compilePotentialExpression(scope, argument))
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
      description ? mTranslationKey(scope, description) : null
   ]
}

export function compileSkill(scope: Scope, skill: Skill): Skill {
   const [ident, name, description] = compileBase(scope, skill, mSkillId)
   const potential = skill.potential?.map(skillPotential => {
      if (skillPotential instanceof PotentialExpressionFunctionOp
          || skillPotential instanceof PotentialExpressionLogicOp) {
         return compilePotentialExpression(scope, skillPotential)
      } else {
         return mSkillId(scope, skillPotential)
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

   const potential = ascensionPerk.potential?.map(
      ascensionPerkPotential => compilePotentialExpression(scope, ascensionPerkPotential)
   )
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

   return new Event(ident, event.event, scope)
}

export function compileTranslation(scope: Scope, translations: Record<string, string>): Record<string, string> {
   const ret: Record<string, string> = {}
   for (const key in translations) {
      const compiledKey = mTranslationKey(scope, key)
      ret[compiledKey] = translations[key]
   }
   return ret
}
