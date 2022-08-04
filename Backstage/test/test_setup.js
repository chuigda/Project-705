const { setupRuleSet } = require('../src/setup')
const { perfectStringify } = require('../src/util/stringify')

const ruleSet = setupRuleSet()

console.log(perfectStringify(ruleSet))
