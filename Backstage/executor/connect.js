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
         if (!Array.isArray(container)) {
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
      default:
         console.warn(`[W] [connect] invalid signal '${signal.signalType}'`)
      }
   }
}

const updatePlayerProperty = (gameContext, property, operator, value, source) => {
   // TODO 暂时只计算 events，但如何计算 modifiers?
   const opRef = { operator, value }
   const propertyPath = property.split['.']
   let container = gameContext.events.playerPropertyUpdated
   let propertyContainer = gameContext.player
   let lastPropertyPath = null
   for (const pathPartIdx in propertyPath) {
      const pathPart = propertyPath[pathPartIdx]
      if (container.all) {
         for (const event of container.all) {
            for (const eventFunction of event.event) {
               eventFunction(gameContext, opRef, source)
            }
         }
      }
      container = container[pathPart]
      if (pathPartIdx !== propertyPath.length - 1) {
         propertyContainer = propertyContainer[pathPart]
         lastPropertyPath = pathPart
      }
   }

   if (!Array.isArray(container)) {
      console.warn(`[W] [updatePlayerProperty] invalid property path: '${property}'`)
      return
   }

   for (const event of container) {
      for (const eventFunction of event.event) {
         eventFunction(gameContext, opRef, source)
      }
   }

   switch (opRef.operator) {
   case 'add':
      propertyContainer[lastPropertyPath] += opRef.value
      break
   case 'sub':
      propertyContainer[lastPropertyPath] -= opRef.value
      break
   case 'set':
      propertyContainer[lastPropertyPath] = opRef.value
      break
   case 'mul':
      propertyContainer[lastPropertyPath] *= opRef.value
      break
   default:
      console.warn(`[W] [updatePlayerProperty] invalid operator '${opRef.operator}'`)
   }
}

module.exports = {
   signals,
   connect,
   updatePlayerProperty
}
