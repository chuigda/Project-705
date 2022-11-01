import { RuleSet } from '@app/ruleset'
import events from './event'
import startups from './startup'
import skillCategories from './skill_categories'
import activityCategories from './activity_categories'
import skills from './skill'
import mapSites from './map_site'
import translations from './translation'
import modifiers from './modifier'

const ruleSet: RuleSet = {
   descriptor: {
      ident: {
         author: 'cnpr',
         moduleName: 'dbg'
      },
      skillCategories,
      activityCategories,
   },
   content: {
      startups,
      skills,
      mapSites,
      translations,
      modifiers,
      events
   }
}

export default ruleSet
