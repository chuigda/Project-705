import { RuleSet } from '@app/ruleset'

import events from '@rulesets/core_ruleset/event'
import startups from '@rulesets/core_ruleset/startup'

const ruleSet: RuleSet = {
   ident: {
      author: 'cnpr',
      moduleName: 'core'
   },
   events,
   startups
}

export default ruleSet
