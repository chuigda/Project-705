const coreRuleSet = require('../src/core_ruleset')
const { ruleSetAssertion } = require('../src/assertions')
const { typeAssert } = require('../src/util/type_assert')

typeAssert(coreRuleSet, ruleSetAssertion)
