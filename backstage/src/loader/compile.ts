import {
   IdMangler, Scope,
   mEventId, mTranslationKey, mSkillId, mActivityId, mStartupId, mAscensionPerkId
} from '@app/base/uid'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { Event, MaybeInlineEvent } from '@app/ruleset/items/event'
import { ItemBase } from '@app/ruleset/items/item_base'
import {
   PotentialExpression,
   PotentialExpressionFunctionOp,
   PotentialExpressionLogicOp
} from '@app/ruleset/items/potential'
import { Skill } from '@app/ruleset/items/skill'
import { Startup } from '@app/ruleset/items/startup'
import { Activity } from '@app/ruleset/items/activity'

export function compilePotentialExpression(scope: Scope, potential: PotentialExpression): PotentialExpression {
   if (potential.op instanceof Function) {
      return {
         op: potential.op,
         description: mTranslationKey(scope, (<PotentialExpressionFunctionOp>potential).description)
      }
   } else {
      return {
         op: potential.op,
         arguments: (<PotentialExpressionLogicOp>potential)
            .arguments
            .map(argument => compilePotentialExpression(scope, argument))
      }
   }
}

export function compileMaybeInlineEvent(scope: Scope, event: MaybeInlineEvent): MaybeInlineEvent {
   if (event instanceof Function) {
      return event
   } else {
      return mEventId(scope, event)
   }
}

export function compileBase(scope: Scope, item: ItemBase, mangler: IdMangler): ItemBase {
   const { ident, name, description } = item
   return {
      ident: mangler(scope, ident),
      name: mTranslationKey(scope, name),
      description: mTranslationKey(scope, description)
   }
}

export function compileSkill(scope: Scope, skill: Skill): Skill {
   const itemBase = compileBase(scope, skill, mSkillId)
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
   return {
      ...itemBase,

      cost,
      potential,
      activities,
      events,

      scope,
      patch
   }
}

export function compileStartup(scope: Scope, startup: Startup): Startup {
   const itemBase = compileBase(scope, startup, mStartupId)

   const events = startup.events?.map(event => compileMaybeInlineEvent(scope, event))

   const { patch, player, modifier } = startup
   return {
      ...itemBase,

      player,
      modifier,
      events,

      scope,
      patch
   }
}

export function compileActivity(scope: Scope, activity: Activity): Activity {
   const itemBase = compileBase(scope, activity, mActivityId)

   const events = activity.events?.map(event => compileMaybeInlineEvent(scope, event))

   const { category, level, output, patch } = activity
   return {
      ...itemBase,

      category,
      level,

      events,
      output,

      scope,
      patch
   }
}

export function compileAscensionPerk(scope: Scope, ascensionPerk: AscensionPerk): AscensionPerk {
   const itemBase = compileBase(scope, ascensionPerk, mAscensionPerkId)

   const potential = ascensionPerk.potential?.map(
      ascensionPerkPotential => compilePotentialExpression(scope, ascensionPerkPotential)
   )
   const events = ascensionPerk.events?.map(event => compileMaybeInlineEvent(scope, event))

   const { modifier, patch } = ascensionPerk
   return {
      ...itemBase,

      potential,
      modifier,
      events,

      scope,
      patch
   }
}

export function compileEvent(scope: Scope, event: Event): Event {
   const ident = mEventId(scope, event.ident)

   return {
      ident,
      scope,
      event: event.event
   }
}

export function compileTranslation(scope: Scope, translations: Record<string, string>): Record<string, string> {
   const ret: Record<string, string> = {}
   for (const key in translations) {
      const compiledKey = mTranslationKey(scope, key)
      ret[compiledKey] = translations[key]
   }
   return ret
}
