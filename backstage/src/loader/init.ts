import { GameContext } from '@app/executor/game_context'
import { CompiledRuleSet } from '@app/loader/index'
import { triggerEvent } from '@app/executor/events'
import { applyStartup } from '@app/executor/startup'
import { computeModifier, computePotentialAscensionPerks, computePotentialSkills } from '@app/executor/compute'
import { initMap } from '@app/executor/map_site'

export default function initGame(ruleSet: CompiledRuleSet, startupId: string): GameContext | undefined {
   const startup = ruleSet.startups[startupId]
   if (!startup) {
      console.error(`[E] [initGame] startup '${startupId}' not found`)
      return undefined
   }

   const context = new GameContext(ruleSet)
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
