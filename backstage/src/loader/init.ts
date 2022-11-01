import { GameContext } from '@app/executor/game_context'
import { CompiledRuleSet } from '@app/loader/index'
import { triggerEvent } from '@app/executor/events'
import { applyStartup } from '@app/executor/startup'
import {
   computeModifier,
   computePotentialAscensionPerks,
   computePotentialSkills
} from '@app/executor/compute'
import { initMap } from '@app/executor/map_site'
import { initProperty, initPropertySimple } from '@app/executor/property'

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

export default function initGame(ruleSet: CompiledRuleSet, startupId: string): GameContext | undefined {
   const startup = ruleSet.startups[startupId]
   if (!startup) {
      console.error(`[E] [initGame] startup '${startupId}' not found`)
      return undefined
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
