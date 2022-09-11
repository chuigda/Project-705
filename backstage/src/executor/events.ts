import { mEventId, Scope } from '@app/base/uid'
import { GameContext } from '@app/executor/game_context'
import { EventFunction, MaybeInlineEvent } from '@app/ruleset/items/event'

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

export function triggerEvent(gameContext: GameContext, event: MaybeInlineEvent, ...args: any[]) {
   const scope = gameContext.scope!

   let unsetCounter = false
   if (gameContext.eventChainCounter === undefined) {
      unsetCounter = true
      gameContext.eventChainCounter = 1
   } else {
      gameContext.eventChainCounter += 1
   }

   if (gameContext.eventChainCounter > 512) {
      console.warn('[W] [triggerEvent] one single event chain has triggered more than 512 event, killing')
      if (unsetCounter) {
         gameContext.eventChainCounter = undefined
      } else {
         gameContext.eventChainCounter -= 1
      }
      return
   }

   if (event instanceof Function) {
      console.debug('[D] [triggerEvent] triggered inline event')
      try {
         event(gameContext, ...args)
      } catch (e) {
         console.error(`[E] [triggerEvent] error when executing inline event script: ${e}\n${e.stack}`)
      }
   } else {
      const eventId = mEventId(scope, event)
      const eventContent = gameContext.ruleSet.events[eventId]

      if (!eventContent) {
         console.error(`[E] [triggerEvent] event '${eventId}' not found`)
      }

      console.debug(`[D] [triggerEvent] triggered event '${eventId}'`)
      const hooks = gameContext.state.events.eventsTriggered[eventId]
      for (const hook in hooks) {
         triggerEvent(gameContext, hook, event, [event, args])
      }

      pushScope(gameContext, scope)
      const eventFunction: EventFunction = eventContent.event
      try {
         eventFunction(gameContext, ...args)
      } catch (e) {
         console.error(`[E] [triggerEvent] error when executing event script '${eventId}': ${e}\n${e.stack}`)
      }
      popScope(gameContext)
   }

   if (unsetCounter) {
      gameContext.eventChainCounter = undefined
   } else {
      gameContext.eventChainCounter -= 1
   }
}

export default {
   triggerEvent
}
