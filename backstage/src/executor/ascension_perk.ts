import { GameContext } from '@app/executor/game_context'
import { Ident, mAscensionPerkId } from '@app/base/uid'
import { ensureScope } from '@app/executor/game_context/scope'
import { triggerEventSeries } from '@app/executor/events'
import { addModifier } from '@app/executor/modifier'
import { concatMessage, QResult } from '@app/executor/result'

export function addAscensionPerkSlot(gameContext: GameContext, count: number): QResult {
   gameContext.state.player.ascensionPerkSlots += count
   gameContext.updateTracker.player.ascensionPerkSlots = true

   return [true]
}

export function activateAscensionPerk(gameContext: GameContext, ascensionPerk: Ident, force?: boolean): QResult {
   const scope = ensureScope(gameContext)
   const ascensionPerkId = mAscensionPerkId(scope, ascensionPerk)
   let apContent
   if (force) {
      apContent = gameContext.ruleSet.ascensionPerks[ascensionPerkId]
      if (!apContent) {
         const errMessage = `ascension perk '${ascensionPerkId}' does not exist`
         console.error(`[E] [activateAscensionPerk] ${errMessage}`)
         return [false, errMessage]
      }
   } else {
      apContent = gameContext.state.computedAscensionPerks!.available[ascensionPerkId]
      if (!apContent) {
         const errMessage = `ascension perk '${ascensionPerkId}' is not available`
         console.error(`[E] [activateAscensionPerk] ${errMessage}`)
         return [false, errMessage]
      }
   }

   console.info(`[I] [activateAscensionPerk] activating ascension perk '${ascensionPerkId}'`)

   let warnMessage
   if (gameContext.state.player.ascensionPerks[ascensionPerkId]) {
      warnMessage = `ascension perk '${ascensionPerkId}' already activated, re-activating`
      console.warn(`[W] [activateAscensionPerk] ${warnMessage}`)
   }

   const { scope: apScope, events } = apContent
   delete gameContext.state.computedAscensionPerks!.available[ascensionPerkId]

   delete gameContext.ascensionPerkPool[ascensionPerkId]
   gameContext.state.player.ascensionPerks[ascensionPerkId] = apContent
   gameContext.updateTracker.player.ascensionPerks = true
   gameContext.updateTracker.computedAscensionPerks = true

   if (apContent.modifier) {
      const [success, message] = addModifier(gameContext, apContent.modifier)
      warnMessage = concatMessage(warnMessage, message)
   }

   const [success, message] = triggerEventSeries(gameContext, events, apScope)
   warnMessage = concatMessage(warnMessage, message)
   return [true, warnMessage]
}

const ascensionPerkFunctions = {
   addAscensionPerkSlot,
   activateAscensionPerk
}

export default ascensionPerkFunctions
