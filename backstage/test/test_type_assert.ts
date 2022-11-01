import { typeAssert } from '@app/util/type_assert'
import coreRuleSet from '@rulesets/core_ruleset'
import debugRuleSet from '@rulesets/debug_ruleset'
import { moduleAssertion } from '@app/loader/assertions'
import { panic } from '@app/util/emergency'

try {
   typeAssert(coreRuleSet, moduleAssertion)
   typeAssert(debugRuleSet, moduleAssertion)
   console.info('Type assert test OK')
} catch (e) {
   panic(e)
}
