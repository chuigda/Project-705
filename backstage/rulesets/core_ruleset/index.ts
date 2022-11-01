import { RuleSet } from '@app/ruleset'

import skills from '@rulesets/core_ruleset/skill'
import events from '@rulesets/core_ruleset/event'
import startups from '@rulesets/core_ruleset/startup'
import ascensionPerks from '@rulesets/core_ruleset/ascension_perk'
import translations from '@rulesets/core_ruleset/translation'
import storeItems from '@rulesets/core_ruleset/store_item'
import modifiers from '@rulesets/core_ruleset/modifier'

const mod: RuleSet = {
   descriptor: {
      ident: {
         author: 'cnpr',
         moduleName: 'core'
      }
   },
   content: {
      skills,
      events,
      startups,
      ascensionPerks,
      modifiers,
      storeItems,
      translations
   }
}

export default mod
