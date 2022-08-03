const { emptyRuleSet, compileRuleSet } = require('./executor/ruleset')
const { typeAssert } = require('./util/type_assert')
const { ruleSetAssertion } = require('./assertions')
const { abort } = require('./util/emergency')
const { loadMods } = require('./mods')

const setupRuleSet = () => {
   const ruleSet = emptyRuleSet()

   try {
      const coreRuleSet = require('./core_ruleset')
      typeAssert(coreRuleSet, ruleSetAssertion)
      compileRuleSet(ruleSet, coreRuleSet)
   } catch (e) {
      console.error(`[E] [setupRuleSet] error when loading core rule set: ${e}`)
      abort()
   }
   loadMods(ruleSet)

   return Object.freeze(ruleSet)
}

module.exports = {
   setupRuleSet
}
