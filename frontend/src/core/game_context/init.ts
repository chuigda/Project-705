import { GameContext } from '@app/core/game_context'
import { CompiledRuleSet } from '@app/core/loader'
import { triggerEvent } from '@app/core/events'
import { applyStartup } from '@app/core/startup'
import {
   computeModifier,
   computePotentialAscensionPerks,
   computePotentialSkills
} from '@app/core/compute'
import { initMap } from '@app/core/map_site'
import { initProperty, initPropertySimple } from '@app/core/property'

function setupCommonProperties(gameContext: GameContext) {
   initPropertySimple(gameContext, '@intelligence', '@', 0)
   initPropertySimple(gameContext, '@emotional_intelligence', '@', 0)
   initPropertySimple(gameContext, '@memorization', '@', 0)
   initPropertySimple(gameContext, '@strength', '@', 0)
   initPropertySimple(gameContext, '@imagination', '@', 0)
   initPropertySimple(gameContext, '@charisma', '@', 0)
   initProperty(gameContext, '@energy', { name: '@', value: 0, min: 0, max: 150 })
   initPropertySimple(gameContext, '@money', '@', 0)
   initPropertySimple(gameContext, '@skill_point', '@', 0)
   initProperty(gameContext, '@mental_health', { name: '@', value: 50, min: 0, max: 100 })
   initProperty(gameContext, '@injury', { name: '@', value: 3, min: 0, max: 3 })
   initPropertySimple(gameContext, '@satisfactory', '@', 50)
}

export default function initGame(ruleSet: CompiledRuleSet, startupId: string): GameContext {
   const startup = ruleSet.startups[startupId]
   if (!startup) {
      throw new Error(`[E] [initGame] 起源 '${startupId}' 不存在`)
   }

   const context = new GameContext(ruleSet)
   setupCommonProperties(context)
   context.state.startup = startupId

   for (const event of ruleSet.onRuleSetLoaded) {
      triggerEvent(context, event)
   }
   applyStartup(context, startup)

   computeModifier(context)
   computePotentialSkills(context)
   computePotentialAscensionPerks(context)
   initMap(context)

   return context
}
