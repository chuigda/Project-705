import { GameContext } from '@app/core/game_context'
import { triggerEvent, triggerEventSeries } from '@app/core/events'
import { computePotentialAscensionPerks, computePotentialSkills } from '@app/core/compute'
import { getProperty } from '@app/core/property'

export function nextTurn(gameContext: GameContext): void {
   console.info('[I] [nextTurn] 正推进到下一回合')

   triggerEventSeries(gameContext, [...gameContext.state.events.turnOver])

   gameContext.state.events.timedEvents = gameContext.state.events.timedEvents.filter(timedEvent => {
      if (timedEvent.turn !== gameContext.state.turns
          || timedEvent.trigger !== 'turn_over') {
         return true
      }

      triggerEvent(gameContext, timedEvent.eventId)
      return false
   })

   gameContext.state.turns += 1
   const energy = getProperty(gameContext, '@energy')
   energy!.value = energy!.max!

   for (const propertyId in gameContext.state.player.properties) {
      const property = gameContext.state.player.properties[propertyId]
      if (property.increment) {
         gameContext.updateProperty(propertyId, 'add', property.increment, '@turn_incr')
      }
   }

   computePotentialSkills(gameContext)
   if (gameContext.state.player.ascensionPerkSlots > Object.keys(gameContext.state.player.ascensionPerks).length) {
      computePotentialAscensionPerks(gameContext)
   }

   triggerEventSeries(gameContext, [...gameContext.state.events.turnStart])

   gameContext.state.events.timedEvents = gameContext.state.events.timedEvents.filter(timedEvent => {
      if (timedEvent.turn !== gameContext.state.turns
          || timedEvent.trigger !== 'turn_start') {
         return true
      }

      triggerEvent(gameContext, timedEvent.eventId)
      return false
   })
}
