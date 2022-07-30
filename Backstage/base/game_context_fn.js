const { eventId } = require('./uid')
const signals = {
   turnStart: () => 'turn_start',
   turnOver: () => 'turn_over',
   skillLearnt: () => 'skill',
   activityPerformed: () => 'activity',

   playerPropertyUpdated: property => ({
      signalType: 'player',
      property,
   }),
   timer: turns => ({
      signalType: 'turns',
      turns
   }),
   countDown: turns => ({
      signalType: 'count_down',
      turns
   }),
   event: eventId => ({
      signalType: 'event',
      eventId
   })
}

const connect = (gameContext, ruleSet, signal, event) => {
   const absoluteEventId = eventId(gameContext.scope, event)
   const absoluteEvent = ruleSet.events[absoluteEventId]

   if (!absoluteEvent) {
      console.warn(`[W] [connect] event '${eventId}(${absoluteEventId})' not found`)
      return
   }

   if (typeof signal === 'string') {
      switch (signal) {
      case 'turn_start':
         gameContext.events.turnStart.push(event)
         break
      case 'turn_over':
         gameContext.events.turnOver.push(event)
         break
      case 'skill':
         gameContext.events.skillLearnt.push(event)
         break
      case 'activity':
         gameContext.events.activityPerformed.push(event)
         break
      }
   } else {
      switch (signal.signalType) {
      case 'player': {
         const propertyPath = signal.property.split('.')
         let container = gameContext.events.playerPropertyUpdated
         for (const pathPart of propertyPath) {
            container = container[pathPart]
         }
         if (container.constructor !== Array.prototype.constructor) {
            console.warn(`[W] [connect] playerPropertyUpdated: invalid property path: '${signal.property}'`)
            return
         }
         container.push(absoluteEvent)
         break
      }
      case 'turns': {
         gameContext.events.timedEvents.push({
            turn: signal.turns,
            event: absoluteEvent
         })
         break
      }
      case 'count_down': {
         gameContext.events.timedEvents.push({
            turn: signal.turns + gameContext.turns,
            event: absoluteEvent
         })
         break
      }
      case 'event': {
         const sourceEventId = eventId(gameContext.scope, signal.eventId)
         if (!gameContext.events.eventsTriggered[sourceEventId]) {
            gameContext.events.eventsTriggered[sourceEventId] = []
         }
         gameContext.events.eventsTriggered[sourceEventId].push(absoluteEvent)
         break
      }
      }
   }
}

module.exports = {
   signals,
   connect
}
