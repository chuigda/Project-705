import { mEventId, Scope } from '@app/base/uid'
import { GameContext } from '@app/executor/game_context'
import { MaybeInlineEvent } from '@app/ruleset/items/event'

export function pushScope(gameContext: GameContext, scope: Scope) {
   if (gameContext.scope) {
      gameContext.scopeChain.push(gameContext.scope)
   }
   gameContext.scope = scope
}

export function popScope(gameContext: GameContext) {
   if (gameContext.scopeChain.length === 0) {
      console.error('[E] [popScope] scope stack is empty')
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
      console.warn('[W] [triggerEvent] one single event chain has triggered more than 512 events, killing')
      if (unsetCounter) {
         gameContext.eventChainCounter = undefined
      } else {
         gameContext.eventChainCounter -= 1
      }
      return
   }

   if (event instanceof Function) {
      try {
         event(gameContext, ...args)
      } catch (e) {
         console.error(`[E] [triggerEvent] error when executing inline event script: ${e}`)
      }
   } else {
      const eventId = mEventId(scope, event)
      const eventContent = gameContext.ruleSet.events[eventId]

      if (!eventContent) {
         console.error(`[E] [triggerEvent] event '${eventId}' not found`)
      }

      const hooks = gameContext.events.eventsTriggered[eventId]
      for (const hook in hooks) {
         triggerEvent(gameContext, hook, event, [event, args])
      }

      pushScope(gameContext, scope)
      for (const idx in eventContent.event) {
         const eventFunction = eventContent.event[idx]
         try {
            eventFunction(gameContext, ...args)
         } catch (e) {
            console.error(`[E] [triggerEvent] error when executing event script '${eventId}:${idx}': ${e}`)
         }
      }
      popScope(gameContext)
   }

   if (unsetCounter) {
      gameContext.eventChainCounter = undefined
   } else {
      gameContext.eventChainCounter -= 1
   }
}
