import { RuleSet } from '@app/ruleset'

import events from '@rulesets/core_ruleset/event'
import startups from '@rulesets/core_ruleset/startup'
import translations from '@rulesets/core_ruleset/translation'

const ruleSet: RuleSet = {
   ident: {
      author: 'cnpr',
      moduleName: 'core'
   },
   events,
   startups,
   translations
}

export default ruleSet
