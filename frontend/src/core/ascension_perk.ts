import { GameContext } from '@app/core/game_context'
import { Ident, mAscensionPerkId } from '@app/core/base/uid'
import { ensureScope } from '@app/core/game_context/scope'
import { triggerEventSeries } from '@app/core/events'
import { addModifier } from '@app/core/modifier'

export function addAscensionPerkSlot(gameContext: GameContext, count: number): void {
   gameContext.state.player.ascensionPerkSlots += count
}

export function activateAscensionPerk(gameContext: GameContext, ascensionPerk: Ident, force?: boolean): void {
   const scope = ensureScope(gameContext)
   const ascensionPerkId = mAscensionPerkId(scope, ascensionPerk)
   let apContent
   if (force) {
      apContent = gameContext.ruleSet.ascensionPerks[ascensionPerkId]
      if (!apContent) {
         throw new Error(`[E] [activateAscensionPerk] ascension perk '${ascensionPerkId}' does not exist`)
      }
   } else {
      apContent = gameContext.state.computedAscensionPerks!.available[ascensionPerkId]
      if (!apContent) {
         throw new Error(`[E] [activateAscensionPerk] ascension perk '${ascensionPerkId}' is not available`)
      }
   }

   console.info(`[I] [activateAscensionPerk] activating ascension perk '${ascensionPerkId}'`)

   if (gameContext.state.player.ascensionPerks[ascensionPerkId]) {
      console.warn(`[W] [activateAscensionPerk] ascension perk '${ascensionPerkId}' already activated, re-activating`)
   }

   const { scope: apScope, events } = apContent
   delete gameContext.state.computedAscensionPerks!.available[ascensionPerkId]

   delete gameContext.ascensionPerkPool[ascensionPerkId]
   gameContext.state.player.ascensionPerks[ascensionPerkId] = apContent

   if (apContent.modifier) {
      addModifier(gameContext, apContent.modifier)
   }

   triggerEventSeries(gameContext, events, apScope)
}

const ascensionPerkFunctions = {
   addAscensionPerkSlot,
   activateAscensionPerk
}

export default ascensionPerkFunctions
