import { GameContext } from '@app/executor/game_context'
import { Ident, mAscensionPerkId } from '@app/base/uid'
import { popScope, pushScope, triggerEvent } from '@app/executor/events'

export function activateAscensionPerk(gameContext: GameContext, ascensionPerk: Ident) {
   const scope = gameContext.scope!
   const ascensionPerkId = mAscensionPerkId(scope, ascensionPerk)
   if (!(gameContext.state.computedAscensionPerks!.available[ascensionPerkId])) {
      console.error(`[E] [activateAscensionPerk] ascension perk '${ascensionPerkId}' is not available`)
      return
   }

   if (gameContext.state.player.ascensionPerks[ascensionPerkId]) {
      console.warn(`[W] [activateAscensionPerk] ascension perk '${ascensionPerkId}' already activated, re-activating`)
   }

   const apContent = gameContext.state.computedAscensionPerks!.available[ascensionPerkId]
   const { scope: apScope, events } = apContent
   delete gameContext.state.computedAscensionPerks!.available[ascensionPerkId]

   gameContext.state.player.ascensionPerks[ascensionPerkId] = apContent
   gameContext.updateTracker.player.ascensionPerks = true
   gameContext.updateTracker.computedAscensionPerks = true

   if (events) {
      if (apScope) {
         pushScope(gameContext, apScope)
      }

      for (const event of events) {
         triggerEvent(gameContext, event)
      }

      if (apScope) {
         popScope(gameContext)
      }
   }
}

const ascensionPerkFunctions = {
   activateAscensionPerk
}

export default ascensionPerkFunctions
