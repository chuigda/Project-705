import { GameContext } from '@app/executor/game_context'
import { triggerEvent } from '@app/executor/events'
import { computePotentialAscensionPerks, computePotentialSkills } from '@app/executor/compute'

export function nextTurn(gameContext: GameContext) {
   console.info('[I] [nextTurn] proceeding to the next turn')

   for (const event of gameContext.state.events.turnOver) {
      triggerEvent(gameContext, event)
   }

   gameContext.state.events.timedEvents = gameContext.state.events.timedEvents.filter(timedEvent => {
      if (timedEvent.turn !== gameContext.state.turns || timedEvent.trigger !== 'turn_over') {
         return true
      }

      triggerEvent(gameContext, timedEvent.eventId)
      return false
   })

   gameContext.state.turns += 1
   gameContext.state.player.energy = gameContext.state.player.energyMax

   computePotentialSkills(gameContext)
   if (gameContext.state.player.ascensionPerkSlots > Object.keys(gameContext.state.player.ascensionPerks).length) {
      computePotentialAscensionPerks(gameContext)
   }

   for (const event of gameContext.state.events.turnStart) {
      triggerEvent(gameContext, event)
   }

   gameContext.state.events.timedEvents = gameContext.state.events.timedEvents.filter(timedEvent => {
      if (timedEvent.turn !== gameContext.state.turns || timedEvent.trigger !== 'turn_start') {
         return true
      }

      triggerEvent(gameContext, timedEvent.eventId)
      return false
   })
}
