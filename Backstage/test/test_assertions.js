const coreRuleSet = require('../core_ruleset')
const { ruleSetAssertion } = require('../src/loader/assertions')
const { typeAssert } = require('../src/util/type_assert_cjs')

typeAssert(coreRuleSet, ruleSetAssertion)
