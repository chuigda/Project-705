const { eventId } = require('../base/uid')

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
   event: sourceEventId => ({
      signalType: 'event',
      eventId: sourceEventId
   })
}

const connect = (gameContext, signal, event) => {
   const absoluteEventId = eventId(gameContext.scope, event)
   const absoluteEvent = gameContext.ruleSet.events[absoluteEventId]

   if (!absoluteEvent) {
      console.warn(`[W] [connect] event '${eventId}(${absoluteEventId})' not found`)
      return
   }

   if (typeof signal === 'string') {
      switch (signal) {
      case 'turn_start':
         gameContext.events.turnStart[absoluteEventId] = absoluteEvent
         break
      case 'turn_over':
         gameContext.events.turnOver[absoluteEventId] = absoluteEvent
         break
      case 'skill':
         gameContext.events.skillLearnt[absoluteEventId] = absoluteEvent
         break
      case 'activity':
         gameContext.events.activityPerformed[absoluteEventId] = absoluteEvent
         break
      default:
         console.warn(`[W] [connect] invalid signal '${signal}'`)
      }
   } else {
      switch (signal.signalType) {
      case 'player': {
         const propertyPath = signal.property.split('.')
         let container = gameContext.events.playerPropertyUpdated
         for (const pathPart of propertyPath) {
            container = container[pathPart]
         }
         if (typeof container !== 'object') {
            console.warn(`[W] [connect] playerPropertyUpdated: invalid property path: '${signal.property}'`)
            return
         }
         container[absoluteEventId] = absoluteEvent
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
         // TODO(chuigda): consider sourceEventId when playing with triggerEvent
         const sourceEventId = eventId(gameContext.scope, signal.eventId)
         if (!gameContext.events.eventsTriggered[sourceEventId]) {
            gameContext.events.eventsTriggered[sourceEventId] = {}
         }
         gameContext.events.eventsTriggered[sourceEventId][absoluteEventId] = absoluteEvent
         break
      }
      default:
         console.warn(`[W] [connect] invalid signal '${signal.signalType}'`)
      }
   }
}

// TODO(chuigda): implement disconnect and disconnectAll

// eslint-disable-next-line no-unused-vars
const disconnect = (gameContext, signal, event) => {}

// eslint-disable-next-line no-unused-vars
const disconnectAll = (gameContext, event) => {}

module.exports = {
   signals,
   connect,
   disconnect,
   disconnectAll
}
