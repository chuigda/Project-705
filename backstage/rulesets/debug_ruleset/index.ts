import { RuleSet } from '@app/ruleset'
import startups from './startup'
import skillCategories from './skill_categories'
import activityCategories from './activity_categories'
import skills from './skill'
import mapSites from './map_site'
import translations from './translation'

const ruleSet: RuleSet = {
   ident: {
      author: 'cnpr',
      moduleName: 'dbg'
   },
   startups,
   skillCategories,
   activityCategories,
   skills,
   mapSites,
   translations
}

export default ruleSet
