import { LogicOps as LogicOp } from '../base/ops'
import { activityId, eventId, skillId, translationKey, startupId, ascensionPerkId, isTranslationKey, Ident, MaybeTranslationKey } from '../base/uid'
import { GameContext, PlayerAttributes } from './game_context'

export type EventFunction = (gameContext: GameContext, ...args: any[]) => void

export class Event {
   readonly ident: Ident
   readonly event: EventFunction[]

   constructor(ident: Ident, event: EventFunction[]) {
      this.ident = ident
      this.event = event
   }
}

export class PotentialExpressionLogicOp {
   readonly op: LogicOp
   readonly arguments: PotentialExpression[]

   constructor(op: LogicOp, args: PotentialExpression[]) {
      this.op = op
      this.arguments = args
   }
}

export type PotentialExpressionFunction = (gameContext: GameContext) => boolean

export class PotentialExpressionFunctionOp {
   readonly op: PotentialExpressionFunction
   readonly description: MaybeTranslationKey

   constructor(op: PotentialExpressionFunction, description: MaybeTranslationKey) {
      this.op = op
      this.description = description
   }
}

export type PotentialExpression = PotentialExpressionLogicOp | PotentialExpressionFunctionOp

export class ItemBase {
   readonly ident: Ident
   readonly name: MaybeTranslationKey
   readonly description: MaybeTranslationKey

   constructor(ident: Ident, name: MaybeTranslationKey, description: MaybeTranslationKey) {
      this.ident = ident
      this.name = name
      this.description = description
   }
}

export type SkillPotentialExpression = PotentialExpression | Ident

export class SkillCost {
   readonly base: number
   readonly attributes?: PlayerAttributes

   constructor(base: number, attributes?: PlayerAttributes) {
      this.base = base
      this.attributes = attributes
   }
}

export class SkillOutput {
   readonly attributes?: PlayerAttributes

   constructor(attributes?: PlayerAttributes) {
      this.attributes = attributes
   }
}

export type MaybeInlineEvent = Ident | EventFunction

export class Skill extends ItemBase {
   readonly category?: string
   readonly potential?: SkillPotentialExpression[]
   readonly cost: SkillCost
   readonly output?: SkillOutput
   readonly activities?: Ident[]
   readonly events?: MaybeInlineEvent[]

   constructor(
      ident: Ident,
      name: MaybeTranslationKey,
      description: MaybeTranslationKey,

      cost: SkillCost,

      optionalArgs: {
         category?: string,
         potential?: SkillPotentialExpression[],
         output?: SkillOutput,
         activities?: Ident[],
         events?: MaybeInlineEvent[]
      }
   ) {
      super(ident, name, description),

      this.cost = cost

      this.category = optionalArgs.category
      this.potential = optionalArgs.potential
      this.output = optionalArgs.output
      this.activities = optionalArgs.activities
      this.events = optionalArgs.events
   }
}

export class CompiledRuleSet {
   skillCategories: string[]
   activityCategories: string[]
   
   events: { [key: string]: Event }
   modifiers: { [key: string]: any } // TODO(chuigda): modifier system rework
   skills: { [key: string]: Skill }
}

const emptyRuleSet = () => ({
   skillCategories: [],
   activityCategories: [],
   events: {},
   modifiers: {},
   skills: {},
   startups: {},
   activities: {},
   ascensionPerks: {},
   translations: {}
})

const compileSkillCategories = (ruleSet, ruleSetIdent, skillCategories) => {
   for (const category of skillCategories) {
      const { ident } = category
      const maybeExistingCategory =
      ruleSet.skillCategories.findIndex(categories => categories.ident === ident)
      if (maybeExistingCategory !== -1) {
         console.warn(`[W] [compileSkillCategories] skill category '${category}' already exists, overwriting`)
         ruleSet.skillCategories[maybeExistingCategory] = category
      } else {
         console.info(`[I] [compileSkillCategories] compiled skill category '${ident}'`)
         ruleSet.skillCategories.push(category)
      }
   }
}

const compileActivityCategories = (ruleSet, activityCategories) => {
   for (const category of activityCategories) {
      if (ruleSet.activityCategories.indexOf(category) !== -1) {
         console.warn(`[W] [compileActivityCategories] activity category '${category}' already exists, skipping`)
      } else {
         console.info(`[I] [compileActivityCategories] compiled activity category '${category}'`)
         ruleSet.activityCategories.push(category)
      }
   }
}

const compilePotentialExpression = (ruleSetIdent, potential) => {
   if (typeof potential.op === 'function') {
      if (potential.description && isTranslationKey(potential.description)) {
         potential.description = translationKey(ruleSetIdent, potential.description)
      }
   } else {
      potential.arguments = potential.arguments.map(argument => compilePotentialExpression(ruleSetIdent, argument))
   }
   return potential
}

const compileEvent = (ruleSetIdent, event) => {
   if (typeof event === 'function') {
      return event
   } else {
      return eventId(ruleSetIdent, event)
   }
}

const compileName = (ruleSetIdent, item) => {
   if (isTranslationKey(item.name)) {
      item.name = translationKey(ruleSetIdent, item.name)
   }
}

const compileDesc = (ruleSetIdent, item) => {
   if (item.description && isTranslationKey(item.description)) {
      item.description = translationKey(ruleSetIdent, item.description)
   }
}

const compileBase = (ruleSetIdent, item, idMangler) => {
   item.ident = idMangler(ruleSetIdent, item.ident)
   item.scope = ruleSetIdent
   compileName(ruleSetIdent, item)
   compileDesc(ruleSetIdent, item)
}

const compileList = (object, field, compilation) => {
   if (object[field]) {
      object[field] = object[field].map(compilation)
   }
}

const compileSkills = (ruleSet, ruleSetIdent, skills) => {
   for (const skill of skills) {
      compileBase(ruleSetIdent, skill, skillId)

      compileList(skill, 'potential', potential => {
         if (typeof potential === 'string' || typeof potential === 'object') {
            return skillId(ruleSetIdent, potential)
         } else {
            return compilePotentialExpression(ruleSetIdent, potential)
         }
      })
      compileList(skill, 'activities', activity => activityId(ruleSetIdent, activity))
      compileList(skill, 'events', event => compileEvent(ruleSetIdent, event))

      if (!ruleSet.skills[skill.ident]) {
         console.info(`[I] [compileSkills] compiled skill ${skill.ident}`)
      } else {
         // TODO(chuigda): 增加对 patch 模式和 overwrite 模式的支持
         console.warn(`[W] [compileSkills] skill '${skill.ident}' already exists, overwriting`)
      }
      ruleSet.skills[skill.ident] = skill
   }
}

const compileStartups = (ruleSet, ruleSetIdent, startups) => {
   for (const startup of startups) {
      compileBase(ruleSetIdent, startup, startupId)

      compileList(startup, 'events', event => compileEvent(ruleSetIdent, event))

      if (!ruleSet.startups[startup.ident]) {
         console.info(`[I] [compileStartups] compiled startup ${startup.ident}`)
      } else {
         console.warn(`[W] [compileStartups] startup '${startup.ident}' already exists, overwriting`)
      }
      ruleSet.startups[startup.ident] = startup
   }
}

const compileActivities = (ruleSet, ruleSetIdent, activities) => {
   for (const activity of activities) {
      compileBase(ruleSetIdent, activity, activityId)

      compileList(activity, 'events', event => compileEvent(ruleSetIdent, event))

      if (!ruleSet.activities[activity.ident]) {
         console.info(`[I] [compileActivities] compiled activity ${activity.ident}`)
      } else {
         console.warn(`[W] [compileActivities] activity '${activity.ident}' already exists, overwriting`)
      }
      ruleSet.activities[activity.ident] = activity
   }
}

const compileAscensionPerks = (ruleSet, ruleSetIdent, ascensionPerks) => {
   for (const ascensionPerk of ascensionPerks) {
      compileBase(ruleSetIdent, ascensionPerk, ascensionPerkId)

      compileList(ascensionPerk, 'potential', potential => compilePotentialExpression(ruleSetIdent, potential))
      compileList(ascensionPerk, 'events', event => compileEvent(ruleSetIdent, event))

      if (!ruleSet.ascensionPerks[ascensionPerk.ident]) {
         console.info(`[I] [compileAscensionPerks] compiled ascension perk ${ascensionPerk.ident}`)
      } else {
         console.warn(`[W] [compileAscensionPerks] ascension perk '${ascensionPerk.ident}' already exists, overwriting`)
      }
      ruleSet.ascensionPerks[ascensionPerk.ident] = ascensionPerk
   }
}

const compileEvents = (ruleSet, ruleSetIdent, events) => {
   for (const event of events) {
      event.ident = eventId(ruleSetIdent, event.ident)
      event.scope = ruleSetIdent

      if (!ruleSet.events[event.ident]) {
         console.info(`[I] [compileEvents] compiled event ${event.ident}`)
      } else {
         console.warn(`[W] [compileEvents] event '${event.ident}' already exists, overwriting`)
      }
      ruleSet.events[event.ident] = event
   }
}

const compileTranslations = (ruleSet, ruleSetIdent, translations) => {
   for (const languageId in translations) {
      const language = translations[languageId]
      if (!ruleSet.translations[languageId]) {
         ruleSet.translations[languageId] = {}
      }

      for (const sentenceKey in language) {
         const key = translationKey(ruleSetIdent, sentenceKey)
         if (ruleSet.translations[key]) {
            console.warn(`[W] [compileTranslation] translation '${key}' already exists, overwriting`)
         } else {
            console.info(`[I] [compileTranslation] compiled translation '${key}'`)
         }
         ruleSet.translations[languageId][key] = language[sentenceKey]
      }
   }
}

const compileRuleSet = (ruleSet, newRuleSet) => {
   const {
      ident: ruleSetIdent,
      skillCategories,
      activityCategories,
      skills,
      startups,
      activities,
      ascensionPerks,
      events,
      translations
   } = newRuleSet
   const { author, moduleName } = ruleSetIdent
   console.info(`[I] [compileRuleSet] Compiling rule set ${author}:${moduleName}`)

   if (skillCategories) {
      compileSkillCategories(ruleSet, ruleSetIdent, skillCategories)
   }

   if (activityCategories) {
      compileActivityCategories(ruleSet, activityCategories)
   }

   if (skills) {
      compileSkills(ruleSet, ruleSetIdent, skills)
   }

   if (startups) {
      compileStartups(ruleSet, ruleSetIdent, startups)
   }

   if (activities) {
      compileActivities(ruleSet, ruleSetIdent, activities)
   }

   if (ascensionPerks) {
      compileAscensionPerks(ruleSet, ruleSetIdent, ascensionPerks)
   }

   if (events) {
      compileEvents(ruleSet, ruleSetIdent, events)
   }

   if (translations) {
      compileTranslations(ruleSet, ruleSetIdent, translations)
   }
}

module.exports = {
   emptyRuleSet,
   compileRuleSet
}
