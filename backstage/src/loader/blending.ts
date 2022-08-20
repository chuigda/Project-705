import { CompiledRuleSet } from '@app/loader'
import { SkillCategory } from '@app/ruleset/items/skill_category'
import { Ident, mDisplayItemId, mEventId, mTranslationKey, Scope } from '@app/base/uid'
import {
   compileActivity,
   compileAscensionPerk,
   compileEvent, compileMaybeInlineEvent,
   compileSkill,
   compileStartup,
   compileTranslation
} from '@app/loader/compile'
import { RuleSet } from '@app/ruleset'
import {
   BubbleMessage, Button, CustomDialog,
   CustomScoreBoard,
   CustomUI,
   DialogBase, DialogItem,
   Divider, Label,
   Menu,
   MenuItem, SimpleDialog,
   UIItem
} from '@app/ruleset/items/ui'

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

interface HasIdent {
   ident: Ident
}

type CompileSingleFunction<T extends HasIdent> = (scope: Scope, item: T) => T

type CompileFunction<T extends HasIdent> = (compilation: CompiledRuleSet, scope: Scope, series: T[]) => void

function buildCompileSeries<T extends HasIdent>(
   itemName: string,
   seriesName: keyof CompiledRuleSet,
   fnName: string,
   compileSingleFn: CompileSingleFunction<T>
) : CompileFunction<T> {
   return (compilation: CompiledRuleSet, scope: Scope, series: T[]) => {
      for (const item of series) {
         const compiledItem = compileSingleFn(scope, item)
         const ident = <string>compiledItem.ident

         const dest = <Record<string, T>>(compilation[seriesName])
         if (dest[ident]) {
            console.warn(`[W] [${fnName}] overwriting existing ${itemName} '${ident}'`)
         } else {
            console.info(`[I] [${fnName}] compiled ${itemName} '${ident}'`)
         }

         // TODO(chuigda): implement "blending"
         dest[ident] = item
      }
   }
}

export const compileSkills = buildCompileSeries(
   'skill',
   'skills',
   'compileSkills',
   compileSkill
)

export const compileActivities = buildCompileSeries(
   'activity',
   'activities',
   'compileActivities',
   compileActivity
)

export const compileStartups = buildCompileSeries(
   'startup',
   'startups',
   'compileStartups',
   compileStartup
)

export const compileAscensionPerks = buildCompileSeries(
   'ascension perk',
   'ascensionPerks',
   'compileAscensionPerks',
   compileAscensionPerk
)

export const compileEvents = buildCompileSeries(
   'event',
   'events',
   'compileEvents',
   compileEvent
)

export class CompiledCustomUI {
   menus: Record<string, Menu> = {}
   dialogs: Record<string, DialogBase> = {}
   bubbles: Record<string, BubbleMessage> = {}
   scoreBoards: Record<string, CustomScoreBoard> = {}
}

export function compileUIItem(scope: Scope, item: MenuItem | UIItem): MenuItem | UIItem {
   if (item instanceof Divider) {
      return item
   } else if (item instanceof Label) {
      return {
         text: mTranslationKey(scope, item.text)
      }
   } else if (item instanceof Button) {
      return {
         ident: mDisplayItemId(scope, item.ident),
         text: mTranslationKey(scope, item.text),
         tooltip: mTranslationKey(scope, item.tooltip),
         events: item.events.map(event => compileMaybeInlineEvent(scope, event))
      }
   } else /* if (item instanceof Menu) */ {
      return {
         ident: mDisplayItemId(scope, item.ident),
         text: mTranslationKey(scope, item.text),
         tooltip: mTranslationKey(scope, item.tooltip),

         children: item.children.map(child => compileUIItem(scope, child))
      }
   }
}

export function compileDialog(scope: Scope, dialog: DialogBase): DialogBase {
   function compileDialogBase(dialogBase: DialogBase): DialogBase {
      return {
         ident: mDisplayItemId(scope, dialogBase.ident),
         title: mTranslationKey(scope, dialogBase.title),
         text: mTranslationKey(scope, dialogBase.text),
         closable: dialogBase.closable,
         onCloseEvents: dialogBase.onCloseEvents?.map(event => compileMaybeInlineEvent(scope, event))
      }
   }

   function compileDialogItem(dialogItem: DialogItem): DialogItem {
      return {
         ...dialogItem,
         item: <UIItem>compileUIItem(scope, dialogItem.item)
      }
   }

   if (dialog instanceof SimpleDialog) {
      const ret: SimpleDialog = {
         ...compileDialogBase(dialog),
         options: dialog.options.map(option => <Button>compileUIItem(scope, option))
      }
      return ret
   } else /* if (dialog instanceof CustomDialog) */ {
      const ret: CustomDialog = {
         ...compileDialogBase(dialog),
         ...(<CustomDialog>dialog),
         items: (<CustomDialog>dialog).items.map(compileDialogItem)
      }
      return ret
   }
}

export function compileUI(compilation: CompiledRuleSet, scope: Scope, ui: CustomUI) {
   if (ui.menus) {
      for (const menu of ui.menus) {
         const compiledMenu = <Menu>compileUIItem(scope, menu)
         const ident = <string>compiledMenu.ident

         if (compilation.ui.menus[ident]) {
            console.warn(`[W] [compileUI] overwriting existing menu '${ident}'`)
         }
         compilation.ui.menus[ident] = compiledMenu
      }
   }

   if (ui.dialogs) {
      for (const dialog of ui.dialogs) {
         const compiledDialog = compileDialog(scope, dialog)
         const ident = <string>compiledDialog.ident

         if (compilation.ui.dialogs[ident]) {
            console.warn(`[W] [compileUI] overwriting existing dialog '${ident}'`)
         }
         compilation.ui.dialogs[ident] = dialog
      }
   }
}

export function compileTranslations(
   compilation: CompiledRuleSet,
   scope: Scope,
   translations: Record<string, Record<string, string>>
) {
   for (const language in translations) {
      const translation = translations[language]
      const compiledTranslation = compileTranslation(scope, translation)

      if (!compilation.translations[language]) {
         compilation.translations[language] = compiledTranslation
      } else {
         for (const translationKey in compiledTranslation) {
            if (compilation.translations[language][translationKey]) {
               console.warn(`[W] [compileTranslations] overwriting existing translation '${translationKey}'`)
            }
            compilation.translations[language][translationKey] = compiledTranslation[translationKey]
         }
      }
   }
}

export function compileRuleSet(compilation: CompiledRuleSet, ruleSet: RuleSet) {
   const {
      ident: scope,
      skillCategories,
      activityCategories,
      skills,
      startups,
      activities,
      ascensionPerks,
      events,
      translations,
      onRuleSetLoaded
   } = ruleSet

   if (skillCategories) {
      compileSkillCategories(compilation, skillCategories)
   }

   if (activityCategories) {
      compileActivityCategories(compilation, activityCategories)
   }

   if (skills) {
      compileSkills(compilation, scope, skills)
   }

   if (startups) {
      compileStartups(compilation, scope, startups)
   }

   if (activities) {
      compileActivities(compilation, scope, activities)
   }

   if (ascensionPerks) {
      compileAscensionPerks(compilation, scope, ascensionPerks)
   }

   if (events) {
      compileEvents(compilation, scope, events)
   }

   if (translations) {
      compileTranslations(compilation, scope, translations)
   }

   if (onRuleSetLoaded) {
      for (const event of onRuleSetLoaded) {
         if (event instanceof Function) {
            compilation.onRuleSetLoaded.push(event)
         } else {
            compilation.onRuleSetLoaded.push(mEventId(scope, event))
         }
      }
   }
}
