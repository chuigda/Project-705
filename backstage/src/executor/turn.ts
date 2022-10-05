import { GameContext } from '@app/executor/game_context'
import { triggerEvent, triggerEventSeries } from '@app/executor/events'
import { computePotentialAscensionPerks, computePotentialSkills } from '@app/executor/compute'
import { concatMessage, QResult } from '@app/executor/result'

export function nextTurn(gameContext: GameContext): QResult {
   console.info('[I] [nextTurn] proceeding to the next turn')

   let warnMessage: string | undefined

   const [success, message] = triggerEventSeries(gameContext, [...gameContext.state.events.turnOver])
   warnMessage = concatMessage(warnMessage, message)

   gameContext.state.events.timedEvents = gameContext.state.events.timedEvents.filter(timedEvent => {
      if (timedEvent.turn !== gameContext.state.turns || timedEvent.trigger !== 'turn_over') {
         return true
      }

      const [success1, message1] = triggerEvent(gameContext, timedEvent.eventId)
      warnMessage = concatMessage(warnMessage, message1)
      return false
   })

   gameContext.state.turns += 1
   gameContext.state.player.energy = gameContext.state.player.energyMax

   computePotentialSkills(gameContext)
   if (gameContext.state.player.ascensionPerkSlots > Object.keys(gameContext.state.player.ascensionPerks).length) {
      computePotentialAscensionPerks(gameContext)
   }

   const [success2, message2] = triggerEventSeries(gameContext, [...gameContext.state.events.turnStart])
   warnMessage = concatMessage(warnMessage, message2)

   gameContext.state.events.timedEvents = gameContext.state.events.timedEvents.filter(timedEvent => {
      if (timedEvent.turn !== gameContext.state.turns || timedEvent.trigger !== 'turn_start') {
         return true
      }

      const [success3, message3] = triggerEvent(gameContext, timedEvent.eventId)
      warnMessage = concatMessage(warnMessage, message3)
      return false
   })

   return [true, warnMessage]
}
