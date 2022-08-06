import { mEventId, Scope } from '../base/uid'
import { GameContext } from './game_context'
import { MaybeInlineEvent } from '../ruleset/items/event'

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

function triggerEventImpl(
   gameContext: GameContext,
   event: MaybeInlineEvent,
   chainEventCounter: { count: number },
   args: any[]
) {
   const scope = gameContext.scope!
   chainEventCounter.count += 1
   if (chainEventCounter.count > 512) {
      console.warn('[W] [triggerEvent] one single event chain has triggered more than 512 events, killing')
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
}

export function triggerEvent(gameContext: GameContext, event: MaybeInlineEvent, ...args: any[]) {
   const counter = { count: 0 }
   triggerEventImpl(gameContext, event, counter, args)
}
