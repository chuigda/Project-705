const skillCategories = require('./skill_categories')
const activityCategories = require('./activity_categories')
const skills = require('./skills')
const startups = require('./startups')
const activities = require('./activities')
const ascensionPerks = require('./ascension_perks')
const events = require('./events')

module.exports = {
   ident: {
      author: 'cnpr_spoof_team',
      moduleName: 'core_ruleset',
   },
   description: '$core_ruleset_desc',
   skillCategories,
   activityCategories,
   skills,
   startups,
   activities,
   ascensionPerks,
   events
}
