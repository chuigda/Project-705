const { emptyRuleSet, compileRuleSet } = require('./executor/ruleset')
const { typeAssert } = require('./util/type_assert_cjs')
const { ruleSetAssertion } = require('./loader/assertions')
const { abort } = require('./util/emergency')

const loadMods = compiledRuleSet => {
   const mods = require('../mods/mods.json')
   try {
      typeAssert(mods, ['string'])
   } catch (e) {
      console.error(`[E] [loadMods] 'mods.json' corrupted, skipping mod loading. reason: ${e}`)
      return
   }

   for (const mod of mods) {
      let modRuleSet = null
      try {
         modRuleSet = require(`./${mod}`)
         typeAssert(modRuleSet, ruleSetAssertion)
      } catch (e) {
         console.error(`[E] [loadMods] mod '${mod}' corrupted, skipping. reason: ${e}`)
         continue
      }

      try {
         compileRuleSet(compiledRuleSet, modRuleSet)
      } catch (e) {
         console.error(`[E] [loadMods] error when loading mod '${mod}': ${e}`)
         abort()
      }
   }
}

const setupRuleSet = () => {
   const ruleSet = emptyRuleSet()

   const startTime = new Date()
   try {
      const coreRuleSet = require('../core_ruleset')
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
