import { mEventId, Scope } from '@app/base/uid'
import { GameContext } from '@app/executor/game_context'
import { EventFunction, MaybeInlineEvent } from '@app/ruleset/items/event'
import { concatMessage, QResult } from '@app/executor/result'

export function pushScope(gameContext: GameContext, scope: Scope) {
   if (gameContext.scope) {
      gameContext.scopeChain.push(gameContext.scope)
   }
   gameContext.scope = scope
}

export function popScope(gameContext: GameContext) {
   if (gameContext.scopeChain.length === 0) {
      gameContext.scope = undefined
      return
   }

   gameContext.scope = gameContext.scopeChain.pop()
}

export function triggerEvent(gameContext: GameContext, event: MaybeInlineEvent, ...args: any[]): QResult {
   const scope = gameContext.scope!

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
      const hooks = gameContext.state.events.eventsTriggered[eventId]
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

export function triggerEventSeries(gameContext: GameContext, events?: MaybeInlineEvent[], scope?: Scope): QResult {
   if (scope) {
      pushScope(gameContext, scope)
   }

   let warnMessage
   if (events) {
      for (const event of events) {
         const [success, message] = triggerEvent(gameContext, event)
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
