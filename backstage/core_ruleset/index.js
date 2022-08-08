const skillCategories = require('./skill_categories')
const activityCategories = require('./activity_categories')
const skills = require('./skills')
const startups = require('./startups')
const activities = require('./activities')
const ascensionPerks = require('./ascension_perks')
const events = require('./events')
const translations = require('./translations')

module.exports = {
   ident: {
      author: 'cnpr',
      moduleName: 'core',
   },
   description: '$core_ruleset_desc',
   skillCategories,
   activityCategories,
   skills,
   startups,
   activities,
   ascensionPerks,
   events,
   translations
}
