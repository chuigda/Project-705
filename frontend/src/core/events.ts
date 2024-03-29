import { mEventId, Scope } from '@app/core/base/uid'
import { GameContext } from '@app/core/game_context'
import { MaybeInlineEvent } from '@app/core/ruleset/items/event'
import { ensureScope, popScope, pushScope } from '@app/core/game_context/scope'

export function triggerEvent(
   gameContext: GameContext,
   event: MaybeInlineEvent,
   ...args: any[]
): void {
   const scope = ensureScope(gameContext)

   let unsetCounter = false
   if (gameContext.eventChainCounter === undefined) {
      unsetCounter = true
      gameContext.eventChainCounter = 1
   } else {
      gameContext.eventChainCounter += 1
   }

   if (gameContext.eventChainCounter > 512) {
      console.warn('[W] [triggerEvent] 事件级联长度超过 512，为避免死循环，已经杀死事件')
      if (unsetCounter) {
         gameContext.eventChainCounter = undefined
      } else {
         gameContext.eventChainCounter -= 1
      }
   }

   if (event instanceof Function) {
      event(gameContext, ...args)
   } else {
      const eventId = mEventId(scope, event)
      const eventContent = gameContext.ruleSet.events[eventId]
      if (!eventContent) {
         if (unsetCounter) {
            gameContext.eventChainCounter = undefined
         } else {
            gameContext.eventChainCounter! -= 1
         }

         throw new Error(`[E] [triggerEvent] 未找到事件 '${eventId}'`)
      }

      const hooks = gameContext.state.events.eventTriggered[eventId]
      for (const hook in hooks) {
         triggerEvent(gameContext, hook, event, [event, args])
      }

      pushScope(gameContext, eventContent.scope!)
      eventContent.event(gameContext, ...args)
      popScope(gameContext)
   }

   if (unsetCounter) {
      gameContext.eventChainCounter = undefined
   } else {
      gameContext.eventChainCounter! -= 1
   }
}

export function triggerEventSeries(
   gameContext: GameContext,
   events?: MaybeInlineEvent[],
   scope?: Scope,
   ...args: any[]
): void {
   if (scope) {
      pushScope(gameContext, scope)
   }

   if (events) {
      for (const event of events) {
         triggerEvent(gameContext, event, ...args)
      }
   }

   if (scope) {
      popScope(gameContext)
   }
}

export default {
   triggerEvent
}
