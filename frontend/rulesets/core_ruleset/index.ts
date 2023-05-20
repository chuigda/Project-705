import { RuleSet } from '@app/core/ruleset'

import skills from '@rulesets/core_ruleset/skill'
import events from '@rulesets/core_ruleset/event'
import startups from '@rulesets/core_ruleset/startup'
import ascensionPerks from '@rulesets/core_ruleset/ascension_perk'
import translations from '@rulesets/core_ruleset/translation'
import storeItems from '@rulesets/core_ruleset/store_item'
import modifiers from '@rulesets/core_ruleset/modifier'

const mod: RuleSet = {
   ident: {
      author: 'cnpr',
      moduleName: 'core'
   },

   name: '$core_ruleset',
   description: '$core_ruleset_desc',

   skills,
   events,
   startups,
   ascensionPerks,
   modifiers,
   storeItems,
   translations
}

export default mod
