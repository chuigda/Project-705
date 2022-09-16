import {
   Ident,
   IdMangler,
   Scope,
   mEventId,
   mTranslationKey,
   mSkillId,
   mActivityId,
   mStartupId,
   mAscensionPerkId,
   mModifierId,
   mDisplayItemId,
   mVarName,
   isTranslationKey
} from '@app/base/uid'
import {
   PotentialExpression,
   PotentialExpressionFunctionOp,
   PotentialExpressionLogicOp
} from '@app/ruleset/items/potential'
import { ItemBase } from '@app/ruleset/items/item_base'
import {
   Activity,
   AscensionPerk,
   Event,
   MaybeInlineEvent,
   Modifier,
   PlayerModifier,
   PlayerModifierGen,
   Skill,
   SkillPointCostModifier,
   SkillPointCostModifierGen,
   Startup
} from '@app/ruleset'
import { CompiledRuleSet } from '@app/loader/index'
import { MaybeTranslatable } from '@app/base/translation'
import {
   BubbleMessageTemplate,
   Button,
   CustomScoreBoard,
   DialogOption,
   Menu,
   MenuItem,
   SimpleDialogTemplate,
   isButton,
   isDivider
} from '@app/ruleset/items/ui'

export function compileTranslatable(scope: Scope, item: MaybeTranslatable): MaybeTranslatable {
   if (typeof item === 'string') {
      if (isTranslationKey(item)) {
         return mTranslationKey(scope, item)
      } else {
         return item
      }
   } else if ('id' in item) {
      return mTranslationKey(scope, item)
   } else {
      return {
         template: mTranslationKey(scope, item.template),
         args: Object.fromEntries(
            Object.entries(item.args).map(
               ([argName, arg]) => [argName, compileTranslatable(scope, arg)]
            )
         )
      }
   }
}

export function compilePotentialExpression(scope: Scope, potential: PotentialExpression): PotentialExpression {
   if (potential.op instanceof Function) {
      return {
         op: potential.op,
         description: compileTranslatable(scope, (<PotentialExpressionFunctionOp>potential).description)
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
      // @ts-ignore
      if (skillPotential.op !== undefined) {
         return compilePotentialExpression(scope, <PotentialExpression>skillPotential)
      } else {
         return mSkillId(scope, <Ident>skillPotential)
      }
   })
   const activities = skill.activities?.map(activity => mActivityId(scope, activity))
   const events = skill.events?.map(event => compileMaybeInlineEvent(scope, event))

   const { category, cost, patch } = skill
   return {
      ...itemBase,
      category,

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
      modifier: modifier ? mModifierId(scope, modifier) : undefined,
      events,

      scope,
      patch
   }
}

export function compileActivity(scope: Scope, activity: Activity): Activity {
   const itemBase = compileBase(scope, activity, mActivityId)

   const events = activity.events?.map(event => compileMaybeInlineEvent(scope, event))

   const { category, level, output, energyCost, patch } = activity
   return {
      ...itemBase,

      category,
      level,

      energyCost,
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
      modifier: modifier ? mModifierId(scope, modifier) : undefined,
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

export function compileModifier(compilation: CompiledRuleSet, scope: Scope, modifier: Modifier): Modifier {
   function compilePlayerModifier(
      playerModifier: PlayerModifier | PlayerModifierGen | undefined
   ): PlayerModifier | undefined {
      if (!playerModifier) {
         return undefined
      }

      if (playerModifier instanceof Function) {
         return playerModifier(compilation)
      } else {
         return playerModifier
      }
   }

   function compileSkillPointCostModifier(
      skillPointCostModifier: SkillPointCostModifier | SkillPointCostModifierGen | undefined
   ): SkillPointCostModifier | undefined {
      if (!skillPointCostModifier) {
         return undefined
      }

      if (skillPointCostModifier instanceof Function) {
         return skillPointCostModifier(compilation)
      } else {
         return skillPointCostModifier
      }
   }

   const itemBase = compileBase(scope, modifier, mModifierId)

   const { player, skillPointCost, patch } = modifier

   return {
      ...itemBase,

      player: compilePlayerModifier(player),
      skillPointCost: compileSkillPointCostModifier(skillPointCost),

      scope,
      patch
   }
}

export function compileMenuItem(scope: Scope, item: MenuItem): MenuItem {
   if (isDivider(item)) {
      return item
   } else if (isButton(item)) {
      item = <Button>item
      return {
         type: 'button',
         ident: mDisplayItemId(scope, item.ident),
         text: compileTranslatable(scope, item.text),
         tooltip: compileTranslatable(scope, item.tooltip),
         events: item.events.map(event => compileMaybeInlineEvent(scope, event))
      }
   } else /* if (isMenu(item)) */ {
      const menu = <Menu>item
      return {
         type: 'menu',
         ident: mDisplayItemId(scope, menu.ident),
         text: compileTranslatable(scope, menu.text),
         tooltip: compileTranslatable(scope, menu.tooltip),

         children: menu.children.map(child => compileMenuItem(scope, child))
      }
   }
}

export function compileScoreBoard(scope: Scope, scoreboard: CustomScoreBoard): CustomScoreBoard {
   return {
      ident: mDisplayItemId(scope, scoreboard.ident),
      tooltip: compileTranslatable(scope, scoreboard.tooltip),
      color: scoreboard.color,
      value: scoreboard.value ? compileTranslatable(scope, scoreboard.value) : undefined,
      bind: scoreboard.bind ? mVarName(scope, scoreboard.bind) : undefined
   }
}

export function compileSimpleDialogTemplate(scope: Scope, template: SimpleDialogTemplate): SimpleDialogTemplate {
   function compileDialogOption(option: DialogOption): DialogOption {
      return {
         ...option,

         text: compileTranslatable(scope, option.text),
         tooltip: compileTranslatable(scope, option.tooltip)
      }
   }

   return {
      ident: mDisplayItemId(scope, template.ident),
      title: compileTranslatable(scope, template.title),
      text: compileTranslatable(scope, template.text),
      options: template.options.map(compileDialogOption)
   }
}

export function compileBubbleMessageTemplate(scope: Scope, template: BubbleMessageTemplate): BubbleMessageTemplate {
   return {
      ident: mDisplayItemId(scope, template.ident),
      icon: template.icon,
      tooltip: compileTranslatable(scope, template.tooltip),
      // TODO(chuigda): linked dialog
      linkedDialog: ''
   }
}

export function compileTranslation(scope: Scope, translation: Record<string, string>): Record<string, string> {
   const ret: Record<string, string> = {}
   for (const key in translation) {
      const compiledKey = mTranslationKey(scope, key)
      ret[compiledKey] = translation[key]
   }
   return ret
}
