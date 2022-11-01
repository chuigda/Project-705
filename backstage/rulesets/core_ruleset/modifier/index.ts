import { Modifier, RuleSetDescriptor } from '@app/ruleset'
import { generateAscensionPerkModifiers } from '@rulesets/core_ruleset/modifier/ascension_perk'

function generateModifiers(summary: RuleSetDescriptor[]): Modifier[] {
   return [
      ...generateAscensionPerkModifiers(summary)
   ]
}

export default generateModifiers
