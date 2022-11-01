import { mEventId, Scope } from '@app/base/uid'
import { GameContext } from '@app/executor/game_context'
import { EventFunction, MaybeInlineEvent } from '@app/ruleset/items/event'
import { concatMessage, QResult } from '@app/executor/result'
import { ensureScope, popScope, pushScope } from '@app/executor/game_context/scope'

export function triggerEvent(
   gameContext: GameContext,
   event: MaybeInlineEvent,
   ...args: any[]
): QResult {
   const scope = ensureScope(gameContext)

   let unsetCounter = false
   if (gameContext.eventChainCounter === undefined) {
      unsetCounter = true
      gameContext.eventChainCounter = 1
   } else {
      gameContext.eventChainCounter += 1
   }

   if (gameContext.eventChainCounter > 512) {
      const warnMessage = 'one single event chain has triggered more than 512 event, killing'
      console.warn(`[W] [triggerEvent] ${warnMessage}`)
      if (unsetCounter) {
         gameContext.eventChainCounter = undefined
      } else {
         gameContext.eventChainCounter -= 1
      }
      return [true, warnMessage]
   }

   let warnMessage
   if (event instanceof Function) {
      console.debug('[D] [triggerEvent] triggered inline event')
      try {
         event(gameContext, ...args)
      } catch (e) {
         const errMessage = `error when executing inline event script: ${e}`
         console.error(`[E] [triggerEvent] ${errMessage}\n${e.stack}`)
         return [false, errMessage]
      }
   } else {
      const eventId = mEventId(scope, event)
      const eventContent = gameContext.ruleSet.events[eventId]
      if (!eventContent) {
         const errMessage = `event '${eventId}' not found`
         console.error(`[E] [triggerEvent] ${errMessage}`)
         if (unsetCounter) {
            gameContext.eventChainCounter = undefined
         } else {
            gameContext.eventChainCounter -= 1
         }
         return [false, errMessage]
      }

      console.debug(`[D] [triggerEvent] triggered event '${eventId}'`)
      const hooks = gameContext.state.events.eventTriggered[eventId]
      for (const hook in hooks) {
         const [success, message] = triggerEvent(gameContext, hook, event, [event, args])
         warnMessage = concatMessage(warnMessage, message)
      }

      pushScope(gameContext, eventContent.scope!)
      const eventFunction: EventFunction = eventContent.event
      try {
         eventFunction(gameContext, ...args)
      } catch (e) {
         const errMessage = `error when executing event script '${eventId}': ${e}`
         console.error(`[E] [triggerEvent] ${errMessage}\n${e.stack}`)

         warnMessage = concatMessage(warnMessage, errMessage)
      }
      popScope(gameContext)
   }

   if (unsetCounter) {
      gameContext.eventChainCounter = undefined
   } else {
      gameContext.eventChainCounter -= 1
   }

   return [true, warnMessage]
}

export function triggerEventSeries(
   gameContext: GameContext,
   events?: MaybeInlineEvent[],
   scope?: Scope,
   ...args: any[]
): QResult {
   if (scope) {
      pushScope(gameContext, scope)
   }

   let warnMessage
   if (events) {
      for (const event of events) {
         const [success, message] = triggerEvent(gameContext, event, ...args)
         warnMessage = concatMessage(warnMessage, message)
      }
   }

   if (scope) {
      popScope(gameContext)
   }

   return [true, warnMessage]
}

export default {
   triggerEvent
}
