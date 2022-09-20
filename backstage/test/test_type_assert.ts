import { typeAssert } from '@app/util/type_assert'
import coreRuleSet from '@rulesets/core_ruleset'
import { ruleSetAssertion } from '@app/loader/assertions'

typeAssert(coreRuleSet, ruleSetAssertion)
