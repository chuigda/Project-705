const { eventId } = require('../base/uid')

const pushScope = (gameContext, scope) => {
   gameContext.scopeChain.push(gameContext.scope)
   gameContext.scope = scope
}

const popScope = gameContext => {
   if (gameContext.scopeChain.length === 0) {
      console.error('[E] [popScope] scope stack is empty')
      return
   }

   gameContext.scope = gameContext.scopeChain.pop()
}

const triggerEvent = (gameContext, event, ...args) => {
   for (const hook of Object.values(gameContext.events.eventsTriggered)) {
      pushScope(gameContext, hook.scope)
      for (const eventFunction of hook.event) {
         eventFunction(gameContext, event)
      }
      popScope(gameContext)
   }

   if (typeof event === 'function') {
      event(gameContext, ...args)
   } else {
      const absoluteEventId = eventId(gameContext.scope, event)
      const eventContent = gameContext.ruleSet.events[absoluteEventId]
      pushScope(gameContext, eventContent.scope)
      for (const eventFunction of eventContent.event) {
         eventFunction(gameContext, ...args)
      }
      popScope(gameContext)
   }
}

module.exports = {
   pushScope,
   popScope,

   triggerEvent
}
