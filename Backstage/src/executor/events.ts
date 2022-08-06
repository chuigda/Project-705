import { Ident, mEventId, Scope } from '../base/uid'
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

export function triggerEvent(gameContext: GameContext, event: MaybeInlineEvent, ...args: any[]) {
   if (event instanceof Function) {
      try {
         event(gameContext, ...args)
      } catch (e) {
         console.error(`[E] [triggerEvent] error when executing inline event script: ${e}`)
      }
   } else {
      const eventId = mEventId(gameContext.scope, event)
      const eventContent = gameContext.ruleSet.events[eventId]

      if (!eventContent) {
         console.error(`[E] [triggerEvent] event '${eventId}' not found`)
      }

      const hooks = gameContext.events.eventsTriggered[eventId]
      for (const hook in hooks) {
         triggerEvent(gameContext, hook, event, [event, args])
      }

      pushScope(gameContext, eventContent.scope)
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
