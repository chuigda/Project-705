const { setupRuleSet } = require('../setup')
const { buildGameContext } = require('../base/game_context')
const {
   computeModifiers,
   computePotentialSkills,
   computePotentialAscensionPerks
} = require('../executor/compute')
const { perfectStringify } = require('../util/stringify')

const ruleSet = setupRuleSet()
const gameContext = buildGameContext(ruleSet)

try {
   computeModifiers(gameContext)
   computePotentialSkills(gameContext)
   computePotentialAscensionPerks(gameContext)

   console.log('modifiers:', perfectStringify(gameContext.computedModifiers))
   console.log('potential skills:', perfectStringify(gameContext.computedSkills))
   console.log('potential ascension perks:', perfectStringify(gameContext.computedAscensionPerks))
} catch (e) {
   console.error(e)
} finally {
   // noinspection InfiniteLoopJS
   while (true) {}
}
