import { HighOrderRuleset, RuleSetDescriptor } from '@app/ruleset'

import skills from '@rulesets/core_ruleset/skill'
import events from '@rulesets/core_ruleset/event'
import startups from '@rulesets/core_ruleset/startup'
import ascensionPerks from '@rulesets/core_ruleset/ascension_perk'
import translations from '@rulesets/core_ruleset/translation'
import storeItems from '@rulesets/core_ruleset/store_item'
import generateModifiers from '@rulesets/core_ruleset/modifier'

const mod: HighOrderRuleset = {
   highOrder: true,
   descriptor: {
      ident: {
         author: 'cnpr',
         moduleName: 'core'
      }
   },
   generator: (summary: RuleSetDescriptor[]) => ({
      skills,
      events,
      startups,
      ascensionPerks,
      modifiers: generateModifiers(summary),
      storeItems,
      translations
   })
}

export default mod
