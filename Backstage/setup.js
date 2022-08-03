const { emptyRuleSet, compileRuleSet } = require('./executor/ruleset')
const { typeAssert } = require('./util/type_assert')
const { ruleSetAssertion } = require('./assertions')
const { abort } = require('./util/emergency')
const { loadMods } = require('./mods')

const setupRuleSet = () => {
   const ruleSet = emptyRuleSet()

   const startTime = new Date()
   try {
      const coreRuleSet = require('./core_ruleset')
      typeAssert(coreRuleSet, ruleSetAssertion)
      compileRuleSet(ruleSet, coreRuleSet)
   } catch (e) {
      console.error(`[E] [setupRuleSet] error when loading core rule set: ${e}`)
      abort()
   }
   loadMods(ruleSet)

   const ret = Object.freeze(ruleSet)
   const endTime = new Date()
   console.info(`[I] [setupRuleSet] loading all rule sets took ${endTime - startTime}ms`)

   return ret
}

module.exports = {
   setupRuleSet
}
