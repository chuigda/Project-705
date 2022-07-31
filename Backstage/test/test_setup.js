const JSON5 = require('json5')

const { setupRuleSet } = require('../setup')

const ruleSet = setupRuleSet()

console.log(JSON5.stringify(ruleSet, { space: 3 }))
