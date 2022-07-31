const JSON5 = require('json5')

const { emptyRuleSet, compileRuleSet } = require('../base/ruleset')
const coreRuleSet = require('../core_ruleset')

const ruleSet = emptyRuleSet()
compileRuleSet(ruleSet, coreRuleSet)

console.log(JSON5.stringify(ruleSet, { space: 3 }))
