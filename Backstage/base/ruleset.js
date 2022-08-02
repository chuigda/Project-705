const { isTranslationKey } = require('./translation')
const { activityId, eventId, skillId, translationKey, startupId, ascensionPerkId } = require('./uid')

const emptyRuleSet = () => ({
   skillCategories: [],
   activityCategories: [],
   events: {},
   modifiers: {},
   skills: {},
   startups: {},
   activities: {},
   ascensionPerks: {}
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
         // TODO 增加对 patch 模式和 overwrite 模式的支持
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

      if (!ruleSet.events[event.ident]) {
         console.info(`[I] [compileEvents] compiled event ${event.ident}`)
      } else {
         console.warn(`[W] [compileEvents] event '${event.ident}' already exists, overwriting`)
      }
      ruleSet.events[event.ident] = event
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
      events
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
}

module.exports = {
   emptyRuleSet,
   compileRuleSet
}
