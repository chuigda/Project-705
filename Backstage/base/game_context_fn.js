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
   }
}

module.exports = {
   signals,
   connect
}
