import startupEvents from '@rulesets/core_ruleset/event/startup'
import activityEvents from '@rulesets/core_ruleset/event/activity'
import ascensionPerkEvents from '@rulesets/core_ruleset/event/ascension_perk'

export default [
   ...startupEvents,
   ...activityEvents,
   ...ascensionPerkEvents
]
