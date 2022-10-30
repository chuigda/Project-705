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
import { initProperty } from '@app/executor/property'

function setupCommonProperties(gameContext: GameContext) {
   initProperty(gameContext, '@intelligence', 0)
   initProperty(gameContext, '@emotional_intelligence', 0)
   initProperty(gameContext, '@memorization', 0)
   initProperty(gameContext, '@strength', 0)
   initProperty(gameContext, '@imagination', 0)
   initProperty(gameContext, '@charisma', 0)
   initProperty(gameContext, '@energy', { value: 0, min: 0, max: 150 })
   initProperty(gameContext, '@money', 0)
   initProperty(gameContext, '@skill_point', 0)
   initProperty(gameContext, '@mental_health', { value: 0, min: 0, max: 100 })
   initProperty(gameContext, '@injury', { value: 3, min: 0, max: 3 })
   initProperty(gameContext, '@satisfactory', 50)
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
