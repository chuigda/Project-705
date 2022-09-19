import { CompiledRuleSet } from '@app/loader'
import { SkillCategory } from '@app/ruleset/items/category'
import { Ident, Scope, mEventId } from '@app/base/uid'
import {
   compileActivity,
   compileAscensionPerk,
   compileBubbleMessageTemplate,
   compileEvent,
   compileMenuItem,
   compileModifier,
   compileScoreBoard,
   compileSimpleDialogTemplate,
   compileSkill,
   compileStartup, compileStoreItem,
   compileTranslation
} from '@app/loader/compile'
import { RuleSet } from '@app/ruleset'
import { Button, CustomUI, Menu } from '@app/ruleset/items/ui'

export function compileSkillCategories(compilation: CompiledRuleSet, skillCategories: SkillCategory[]) {
   for (const category of skillCategories) {
      const { ident } = category
      const maybeExistingCategory = compilation.skillCategories.findIndex((category1) => category1.ident === ident)
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
): CompileFunction<T> {
   return (compilation: CompiledRuleSet, scope: Scope, series: T[]) => {
      for (const item of series) {
         const compiledItem = compileSingleFn(scope, item)
         const ident = <string>compiledItem.ident

         const dest = <Record<string, T>>(<unknown>compilation[seriesName])
         if (dest[ident]) {
            console.warn(`[W] [${fnName}] overwriting existing ${itemName} '${ident}'`)
         } else {
            console.info(`[I] [${fnName}] compiled ${itemName} '${ident}'`)
         }

         // TODO(chuigda): implement "blending"
         dest[ident] = compiledItem
      }
   }
}

type CompileSingleFunction2<T extends HasIdent> = (compilation: CompiledRuleSet, scope: Scope, item: T) => T

function buildCompileSeries2<T extends HasIdent>(
   itemName: string,
   seriesName: keyof CompiledRuleSet,
   fnName: string,
   compileSingleFn: CompileSingleFunction2<T>
): CompileFunction<T> {
   return (compilation: CompiledRuleSet, scope: Scope, series: T[]) => {
      for (const item of series) {
         const compiledItem = compileSingleFn(compilation, scope, item)
         const ident = <string>compiledItem.ident

         const dest = <Record<string, T>>(<unknown>compilation[seriesName])
         if (dest[ident]) {
            console.warn(`[W] [${fnName}] overwriting existing ${itemName} '${ident}'`)
         } else {
            console.info(`[I] [${fnName}] compiled ${itemName} '${ident}'`)
         }

         // TODO(chuigda): implement "blending"
         dest[ident] = compiledItem
      }
   }
}

export const compileSkills = buildCompileSeries('skill', 'skills', 'compileSkills', compileSkill)

export const compileActivities = buildCompileSeries('activity', 'activities', 'compileActivities', compileActivity)

export const compileStartups = buildCompileSeries('startup', 'startups', 'compileStartups', compileStartup)

export const compileAscensionPerks = buildCompileSeries(
   'ascension perk',
   'ascensionPerks',
   'compileAscensionPerks',
   compileAscensionPerk
)

export const compileEvents = buildCompileSeries('event', 'events', 'compileEvents', compileEvent)

export const compileModifiers = buildCompileSeries2('modifier', 'modifiers', 'compileModifiers', compileModifier)

export const compileStoreItems = buildCompileSeries('store item', 'storeItems', 'compileStoreItems', compileStoreItem)

function buildCompileUISeries<T extends HasIdent>(
   itemName: string,
   seriesName: 'scoreBoards' | 'dialogTemplates' | 'bubbleMessageTemplates',
   fnName: string,
   compileSingleFn: CompileSingleFunction<T>
): CompileFunction<T> {
   return (compilation: CompiledRuleSet, scope: Scope, series: T[]) => {
      for (const item of series) {
         const compiledItem = compileSingleFn(scope, item)
         const ident = <string>compiledItem.ident

         const dest = <Record<string, T>>(<unknown>compilation.ui[seriesName])
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

export const compileScoreBoards = buildCompileUISeries(
   'score board',
   'scoreBoards',
   'compileScoreBoard',
   compileScoreBoard
)

export const compileDialogTemplates = buildCompileUISeries(
   'dialog template',
   'dialogTemplates',
   'compileSimpleDialogTemplate',
   compileSimpleDialogTemplate
)

export const compileBubbleMessageTemplates = buildCompileUISeries(
   'bubble message template',
   'bubbleMessageTemplates',
   'compileBubbleMessageTemplate',
   compileBubbleMessageTemplate
)

export function compileUI(compilation: CompiledRuleSet, scope: Scope, ui: CustomUI) {
   if (ui.menus) {
      for (const menu of ui.menus) {
         const compiledMenu = <Menu>compileMenuItem(scope, menu)
         const ident = <string>compiledMenu.ident

         if (compilation.ui.menus[ident]) {
            console.warn(`[W] [compileUI] overwriting existing menu '${ident}'`)
         } else {
            console.warn(`[I] [compileUI] compiled '${ident}'`)
         }
         compilation.ui.menus[ident] = compiledMenu
      }
   }

   if (ui.buttons) {
      for (const button of ui.buttons) {
         const compiledButton = <Button>compileMenuItem(scope, button)
         const ident = <string>compiledButton.ident

         if (compilation.ui.buttons[ident]) {
            console.warn(`[W] [compileUI] overwriting existing button '${ident}'`)
         } else {
            console.warn(`[I] [compileUI] compiled '${ident}'`)
         }
         compilation.ui.buttons[ident] = compiledButton
      }
   }

   if (ui.scoreBoards) {
      compileScoreBoards(compilation, scope, ui.scoreBoards)
   }

   if (ui.dialogTemplates) {
      compileDialogTemplates(compilation, scope, ui.dialogTemplates)
   }

   if (ui.bubbleMessageTemplates) {
      compileBubbleMessageTemplates(compilation, scope, ui.bubbleMessageTemplates)
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

export function preCompileRuleSet(compilation: CompiledRuleSet, ruleSet: RuleSet) {
   const { ident, skillCategories, activityCategories } = ruleSet

   if (compilation.loadedRuleSets.find(
      thatIdent => thatIdent.moduleName === ident.moduleName
         && thatIdent.author === ident.author
   )) {
      console.warn(`[W] [preCompileRuleSet] duplicate mod identifier: '${ident.author}:${ident.moduleName}'`)
   }

   compilation.loadedRuleSets.push(ident)

   if (skillCategories) {
      compileSkillCategories(compilation, skillCategories)
   }

   if (activityCategories) {
      compileActivityCategories(compilation, activityCategories)
   }
}

export function compileRuleSet(compilation: CompiledRuleSet, ruleSet: RuleSet) {
   const {
      ident: scope,
      skills,
      startups,
      activities,
      ascensionPerks,
      storeItems,
      events,
      modifiers,
      translations,
      ui,
      onRuleSetLoaded
   } = ruleSet

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

   if (storeItems) {
      compileStoreItems(compilation, scope, storeItems)
   }

   if (events) {
      compileEvents(compilation, scope, events)
   }

   if (modifiers) {
      compileModifiers(compilation, scope, modifiers)
   }

   if (translations) {
      compileTranslations(compilation, scope, translations)
   }

   if (ui) {
      compileUI(compilation, scope, ui)
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
