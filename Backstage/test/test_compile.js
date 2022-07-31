const { emptyRuleSet, compileRuleSet } = require('../base/ruleset')
const coreRuleSet = require('../core_ruleset')

const ruleSet = emptyRuleSet()
compileRuleSet(ruleSet, coreRuleSet)

console.log(ruleSet)

for (;;) {}
