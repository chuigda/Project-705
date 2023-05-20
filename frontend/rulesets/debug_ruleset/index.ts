import { RuleSet } from '@app/core/ruleset'
import events from './event'
import startups from './startup'
import skills from './skill'
import mapSites from './map_site'
import translations from './translation'
import modifiers from './modifier'

const ruleSet: RuleSet = {
   ident: {
      author: 'cnpr',
      moduleName: 'dbg'
   },

   name: '$debug_ruleset',
   description: '$debug_ruleset_desc',

   startups,
   skills,
   mapSites,
   translations,
   modifiers,
   events
}

export default ruleSet
