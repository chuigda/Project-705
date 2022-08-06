const coreRuleSet = require('../core_ruleset')
const { ruleSetAssertion } = require('../assertions')
const { typeAssert } = require('../util/type_assert')

typeAssert(coreRuleSet, ruleSetAssertion)
