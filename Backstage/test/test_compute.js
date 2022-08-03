const { setupRuleSet } = require('../setup')
const { buildGameContext } = require('../base/game_context')
const {
   computeModifiers,
   computePotentialSkills,
   computePotentialAscensionPerks,
   recomputeSkillCosts
} = require('../executor/compute')
const { perfectStringify } = require('../util/stringify')
const { translatePotentialResult } = require('../repr')

const ruleSet = setupRuleSet()
const gameContext = buildGameContext(ruleSet)

try {
   computeModifiers(gameContext)
   computePotentialSkills(gameContext)
   computePotentialAscensionPerks(gameContext)

   recomputeSkillCosts(gameContext)

   console.log('modifiers:', perfectStringify(gameContext.computedModifiers))
   console.log('potential skills:', perfectStringify(gameContext.computedSkills))
   console.log('potential ascension perks:', perfectStringify(gameContext.computedAscensionPerks))

   for (const ap of Object.values(gameContext.computedAscensionPerks.unavailable)) {
      console.log(perfectStringify(translatePotentialResult(
         'zh_cn',
         ruleSet.translations,
         ap.resultPieces
      )))
   }
} catch (e) {
   console.error(e)
} finally {
   // noinspection InfiniteLoopJS
   // eslint-disable-next-line no-empty, no-constant-condition
   while (true) {}
}
