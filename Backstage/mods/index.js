const { ruleSetAssertion } = require('../assertions')
const { typeAssert, preventErrTrace } = require('../util/type_assert')
const { compileRuleSet } = require('../base/ruleset')
const { abort } = require('../util/emergency')

const loadMods = compiledRuleSet => {
   preventErrTrace(true)

   const mods = require('./mods.json')
   try {
      typeAssert(mods, ['string'])
   } catch (e) {
      console.error(`[E] [loadMods] 'mods.json' corrupted, skipping mod loading. reason: ${e}`)
      return false
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

   return true
}

module.exports = { loadMods }
