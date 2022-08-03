const { setupRuleSet } = require('../setup')
const { perfectStringify } = require('../util/stringify')

const ruleSet = setupRuleSet()

console.log(perfectStringify(ruleSet))
