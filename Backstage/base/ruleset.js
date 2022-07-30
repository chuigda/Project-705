const { isTranslationKey } = require('./translation')
const { activityId, eventId, skillId, translationKey } = require('./uid')

const emptyRuleSet = () => ({
   skillCategories: {},
   activityCategories: [],
   events: {},
   modifiers: {},
   skills: {},
   activities: {},
   ascensionPerks: {}
})

const compileSkillCategories = (ruleSet, ruleSetIdent, skillCategories) => {
   for (const categoryId in Object.entries(skillCategories)) {
      const category = skillCategories[categoryId]
      if (isTranslationKey(category.name)) {
         category.name = translationKey(ruleSetIdent, category.name)
      }

      if (ruleSet.skillCategories[categoryId]) {
         console.warn(`[W] [compileSkillCategories] skill category '${categoryId}' already exists, overwriting`)
      }
      ruleSet.skillCategories[categoryId] = category[categoryId]
   }
}

const compileActivityCategories = (ruleSet, activityCategories) => {
   for (const category of activityCategories) {
      if (ruleSet.activityCategories.indexOf(category) !== -1) {
         console.warn(`[W] [compileActivityCategories] activity category '${category}' already exists, skipping`)
      } else {
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

const compileSkills = (ruleSet, ruleSetIdent, skills) => {
   for (const skill of skills) {
      skill.ident = skillId(ruleSetIdent, skill.ident)
      if (isTranslationKey(skill.name)) {
         skill.name = translationKey(ruleSetIdent, skill.name)
      }
      if (skill.description && isTranslationKey(skill.description)) {
         skill.description = translationKey(ruleSetIdent, skill.description)
      }
      if (skill.requirements) {
         skill.requirements = skill.requirements.map(requirement => {
            if (typeof requirement === 'string' || typeof requirement === 'object') {
               return skillId(ruleSetIdent, requirement)
            } else {
               return compilePotentialExpression(ruleSetIdent, requirement)
            }
         })
      }
      if (skill.activities) {
         skill.activities = skill.activities.map(activity => activityId(ruleSetIdent, activity))
      }
      if (skill.events) {
         skill.events = skill.events.map(event => eventId(ruleSetIdent, event))
      }

      if (!ruleSet.skills[skill.ident]) {
         console.info(`[I] [compileSkills] compiled skill ${skill.ident}`)
      } else {
         // TODO 增加对 patch 模式和 overwrite 模式的支持
         console.warn(`[W] [compileSkills] skill '${skill.ident}' already exists, overwriting`)
      }
      ruleSet.skills[skill.ident] = skill
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
}

module.exports = {
   emptyRuleSet,
   compileRuleSet
}
