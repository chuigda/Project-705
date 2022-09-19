import { GameContext } from '@app/executor/game_context'
import { Ident, mAscensionPerkId } from '@app/base/uid'
import { popScope, pushScope, triggerEvent } from '@app/executor/events'
import { addModifier } from '@app/executor/modifier'

export function addAscensionPerkSlot(gameContext: GameContext, count: number) {
   gameContext.state.player.ascensionPerkSlots += count
   gameContext.updateTracker.player.ascensionPerkSlots = true
}

export function activateAscensionPerk(gameContext: GameContext, ascensionPerk: Ident) {
   const scope = gameContext.scope!
   const ascensionPerkId = mAscensionPerkId(scope, ascensionPerk)
   if (!(gameContext.state.computedAscensionPerks!.available[ascensionPerkId])) {
      console.error(`[E] [activateAscensionPerk] ascension perk '${ascensionPerkId}' is not available`)
      return
   }

   console.info(`[I] [activateAscensionPerk] activating ascension perk '${ascensionPerkId}'`)
   if (gameContext.state.player.ascensionPerks[ascensionPerkId]) {
      console.warn(`[W] [activateAscensionPerk] ascension perk '${ascensionPerkId}' already activated, re-activating`)
   }

   const apContent = gameContext.state.computedAscensionPerks!.available[ascensionPerkId]
   const { scope: apScope, events } = apContent
   delete gameContext.state.computedAscensionPerks!.available[ascensionPerkId]

   delete gameContext.ascensionPerkPool[ascensionPerkId]
   gameContext.state.player.ascensionPerks[ascensionPerkId] = apContent
   gameContext.updateTracker.player.ascensionPerks = true
   gameContext.updateTracker.computedAscensionPerks = true

   if (apContent.modifier) {
      addModifier(gameContext, apContent.modifier)
   }

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
   addAscensionPerkSlot,
   activateAscensionPerk
}

export default ascensionPerkFunctions
