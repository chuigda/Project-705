import { CompiledRuleSet, CompiledStoreItems } from '@app/core/loader'
import { SkillCategory } from '@app/core/ruleset/items/category'
import { Ident, Scope, mEventId } from '@app/core/base/uid'
import {
   compileActiveRelicItem,
   compileActivity,
   compileAscensionPerk,
   compileConsumableItem,
   compileEvent,
   compileMapSite,
   compileModifier,
   compilePassiveRelicItem,
   compileRechargeableItem,
   compileSkill,
   compileStartup,
   compileTradableItem,
   compileTranslation
} from '@app/core/loader/compile'
import {
   RuleSet,
   RuleSetStoreItems,
   StoreItem,
   StoreItemKind
} from '@app/core/ruleset'

export function compileSkillCategories(compilation: CompiledRuleSet, skillCategories: SkillCategory[]) {
   for (const category of skillCategories) {
      const { ident } = category
      const maybeExistingCategory = compilation.skillCategories.findIndex((category1) => category1.ident === ident)
      if (maybeExistingCategory !== -1) {
         console.warn(`[W] [compileSkillCategories] 技能类别 '${category}' 已经存在，覆写`)
         compilation.skillCategories[maybeExistingCategory] = category
      } else {
         compilation.skillCategories.push(category)
      }
      console.info(`[I] [compileSkillCategories] 已编译技能类别 '${ident}'`)
   }
}

export function compileActivityCategories(compilation: CompiledRuleSet, activityCategories: string[]) {
   for (const category of activityCategories) {
      if (compilation.activityCategories.indexOf(category) !== -1) {
         console.warn(`[W] [compileActivityCategories] 活动类别 '${category}' 已经存在，覆写`)
      } else {
         compilation.activityCategories.push(category)
      }
      console.info(`[I] [compileActivityCategories] 已编译活动类别 '${category}'`)
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
            console.warn(`[W] [${fnName}] 覆写已经存在的 ${itemName} '${ident}'`)
         }
         console.info(`[I] [${fnName}] 已编译${itemName} '${ident}'`)

         // TODO(chuigda): implement "blending"
         dest[ident] = compiledItem
      }
   }
}

function precompileSelectScope(scope: Scope, item: /* { scope?: Scope } */ any): Scope {
   return item.scope ?? scope
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
         scope = precompileSelectScope(scope, item)
         const compiledItem = compileSingleFn(compilation, scope, item)
         const ident = <string>compiledItem.ident

         const dest = <Record<string, T>>(<unknown>compilation[seriesName])
         if (dest[ident]) {
            console.warn(`[W] [${fnName}] 覆写已经存在的 ${itemName} '${ident}'`)
         }
         console.info(`[I] [${fnName}] 已编译${itemName} '${ident}'`)

         // TODO(chuigda): implement "blending"
         dest[ident] = compiledItem
      }
   }
}

export const compileSkills = buildCompileSeries('技能', 'skills', 'compileSkills', compileSkill)

export const compileActivities = buildCompileSeries('活动', 'activities', 'compileActivities', compileActivity)

export const compileStartups = buildCompileSeries('起源', 'startups', 'compileStartups', compileStartup)

export const compileAscensionPerks = buildCompileSeries(
   '飞升项目',
   'ascensionPerks',
   'compileAscensionPerks',
   compileAscensionPerk
)

export const compileMapSites = buildCompileSeries('地图节点', 'mapSites', 'compileMapSites', compileMapSite)

export const compileEvents = buildCompileSeries('事件', 'events', 'compileEvents', compileEvent)

export const compileModifiers = buildCompileSeries2('修正', 'modifiers', 'compileModifiers', compileModifier)

function buildCompileStoreItemSeries<IKS extends StoreItemKind, T extends StoreItem<IKS>>(
   itemName: string,
   seriesName: keyof CompiledStoreItems,
   fnName: string,
   compileSingleFn: CompileSingleFunction<T>
): CompileFunction<T> {
   return (compilation: CompiledRuleSet, scope: Scope, series: T[]) => {
      for (const item of series) {
         scope = precompileSelectScope(scope, item)
         const compiledItem = compileSingleFn(scope, item)
         const ident = <string>compiledItem.ident

         const dest = <Record<string, T>>(<unknown>compilation.storeItems[seriesName])
         if (dest[ident]) {
            console.warn(`[W] [${fnName}] 覆写已经存在的 ${itemName} '${ident}'`)
         }
         console.info(`[I] [${fnName}] 已编译商店物品 (${itemName}) '${ident}'`)

         // TODO(chuigda): implement "blending"
         dest[ident] = item
      }
   }
}

export const compileConsumableItems = buildCompileStoreItemSeries(
   '消耗品',
   'consumableItems',
   'compileConsumableItems',
   compileConsumableItem
)

export const compileRechargeableItems = buildCompileStoreItemSeries(
   '可充能物品',
   'rechargeableItems',
   'compileRechargeableItems',
   compileRechargeableItem
)

export const compileActiveRelicItems = buildCompileStoreItemSeries(
   '具有主动技能的物品',
   'activeRelicItems',
   'compileActiveRelicItems',
   compileActiveRelicItem
)

export const compilePassiveRelicItems = buildCompileStoreItemSeries(
   '被动型物品',
   'passiveRelicItems',
   'compilePassiveRelicItems',
   compilePassiveRelicItem
)

export const compileTradableItems = buildCompileStoreItemSeries(
   '可交易物品',
   'tradableItems',
   'compileTradableItems',
   compileTradableItem
)

export function compileStoreItems(compilation: CompiledRuleSet, scope: Scope, storeItems: RuleSetStoreItems) {
   const {
      consumableItems,
      rechargeableItems,
      activeRelicItems,
      passiveRelicItems,
      tradableItems
   } = storeItems

   if (consumableItems) {
      compileConsumableItems(compilation, scope, consumableItems)
   }

   if (rechargeableItems) {
      compileRechargeableItems(compilation, scope, rechargeableItems)
   }

   if (activeRelicItems) {
      compileActiveRelicItems(compilation, scope, activeRelicItems)
   }

   if (passiveRelicItems) {
      compilePassiveRelicItems(compilation, scope, passiveRelicItems)
   }

   if (tradableItems) {
      compileTradableItems(compilation, scope, tradableItems)
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
               console.warn(`[W] [compileTranslations] 覆盖已经存在的翻译项目 '${translationKey}'`)
            }
            compilation.translations[language][translationKey] = compiledTranslation[translationKey]
         }
      }
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
      mapSites,
      events,
      modifiers,
      translations,
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

   if (mapSites) {
      compileMapSites(compilation, scope, mapSites)
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
