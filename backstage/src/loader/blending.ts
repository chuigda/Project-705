import { CompiledRuleSet } from '@app/loader'
import { SkillCategory } from '@app/ruleset/items/skill_category'
import { Ident, mEventId, Scope } from '@app/base/uid'
import {
   compileActivity,
   compileAscensionPerk,
   compileEvent,
   compileSkill,
   compileStartup,
   compileTranslation
} from '@app/loader/compile'
import { RuleSet } from '@app/ruleset'

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
