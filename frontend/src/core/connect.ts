import { Ident, mEventId, mPropertyId } from '@app/core/base/uid'
import { GameContext, TimedEventTrigger } from '@app/core/game_context'
import { PropertyId } from '@app/core/game_context/player'
import { ensureScope } from '@app/core/game_context/scope'

export type Signal = { signalType: string }
export type SkillSignal = Signal & { skillId: string }
export type ActivitySignal = Signal & { activityId: string }
export type PropertyUpdatedSignal = Signal & { property: PropertyId }
export type TurnsSignal = Signal & { turns: number, trigger: TimedEventTrigger }
export type EventSignal = Signal & { eventId: string }

export const signals: Record<string, (...args: any[]) => Signal> = {
   turnStart: (): Signal => ({ signalType: 'turn_start' }),
   turnOver: (): Signal => ({ signalType: 'turn_over' }),
   skillLearnt: (skillId: string): SkillSignal => ({
      signalType: 'skill',
      skillId
   }),
   activityPerformed: (activityId: string): ActivitySignal => ({
      signalType: 'activity',
      activityId
   }),
   propertyUpdated: (property: PropertyId): PropertyUpdatedSignal => ({
      signalType: 'property',
      property,
   }),
   propertyOverflow: (property: PropertyId): PropertyUpdatedSignal => ({
      signalType: 'property_overflow',
      property
   }),
   propertyUnderflow: (property: PropertyId): PropertyUpdatedSignal => ({
      signalType: 'property_underflow',
      property
   }),
   timer: (turns: number, trigger: TimedEventTrigger): TurnsSignal => ({
      signalType: 'turns',
      turns,
      trigger
   }),
   countDown: (turns: number, trigger: TimedEventTrigger): TurnsSignal => ({
      signalType: 'count_down',
      turns,
      trigger
   }),
   event: (sourceEventId: string): EventSignal => ({
      signalType: 'event',
      eventId: sourceEventId
   })
}

export function connect(gameContext: GameContext, signal: Signal, event: Ident) {
   const eventId = mEventId(ensureScope(gameContext), event)

   if (!(eventId in gameContext.ruleSet.events)) {
      console.warn(`[W] [connect] 事件 '${event}(${eventId})' 不存在`)
      return
   }

   switch (signal.signalType) {
      case 'turn_start':
         gameContext.state.events.turnStart.add(eventId)
         break
      case 'turn_over':
         gameContext.state.events.turnOver.add(eventId)
         break
      case 'skill': {
         const sig = <SkillSignal>signal
         if (!(sig.skillId in gameContext.state.events.skillLearnt)) {
            gameContext.state.events.skillLearnt[sig.skillId] = new Set()
         }
         gameContext.state.events.skillLearnt[sig.skillId].add(eventId)
         break
      }
      case 'activity': {
         const sig = <ActivitySignal>signal
         if (!(sig.activityId in gameContext.state.events.activityPerformed)) {
            gameContext.state.events.activityPerformed[sig.activityId] = new Set()
         }
         gameContext.state.events.activityPerformed[sig.activityId].add(eventId)
         break
      }
      case 'property': {
         const sig = <PropertyUpdatedSignal>signal
         const propertyId = mPropertyId(ensureScope(gameContext), sig.property)
         const container = gameContext.state.events.propertyUpdated[propertyId]
         if (!container) {
            console.warn(`[W] [connect] playerPropertyUpdated: 属性 '${propertyId}' 未定义`)
            return
         }
         container.push(eventId)
         break
      }
      case 'property_overflow': {
         const sig = <PropertyUpdatedSignal>signal
         const propertyId = mPropertyId(ensureScope(gameContext), sig.property)
         const container = gameContext.state.events.propertyOverflow[propertyId]
         if (!container) {
            console.warn(`[W] [connect] playerPropertyUnderflow: 属性 '${propertyId}' 未定义`)
            return
         }
         container.push(eventId)
         break
      }
      case 'property_underflow': {
         const sig = <PropertyUpdatedSignal>signal
         const propertyId = mPropertyId(ensureScope(gameContext), sig.property)
         const container = gameContext.state.events.propertyUnderflow[propertyId]
         if (!container) {
            console.warn(`[W] [connect] playerPropertyUnderflow: 属性 '${propertyId}' 未定义`)
            return
         }
         container.push(eventId)
         break
      }
      case 'turns': {
         const sig = <TurnsSignal>signal
         gameContext.state.events.timedEvents.push({
            turn: sig.turns,
            eventId,
            trigger: sig.trigger
         })
         break
      }
      case 'count_down': {
         const sig = <TurnsSignal>signal
         gameContext.state.events.timedEvents.push({
            turn: sig.turns + gameContext.state.turns,
            eventId,
            trigger: sig.trigger
         })
         break
      }
      case 'event': {
         const sig = <EventSignal>signal
         const sourceEventId = mEventId(ensureScope(gameContext), sig.eventId)
         if (!gameContext.state.events.eventTriggered[sourceEventId]) {
            gameContext.state.events.eventTriggered[sourceEventId] = new Set()
         }
         gameContext.state.events.eventTriggered[sourceEventId].add(eventId)
         break
      }
      default:
         console.warn(`[W] [connect] 无效的信号类型 '${signal.signalType}'`)
   }
}

export function disconnect(gameContext: GameContext, signal: Signal, event: Ident) {
   const eventId = mEventId(ensureScope(gameContext), event)

   if (!(eventId in gameContext.ruleSet.events)) {
      console.warn(`[W] [connect] 事件 '${event}(${eventId})' 不存在`)
      return
   }

   switch (signal.signalType) {
      case 'turn_start':
         gameContext.state.events.turnStart.delete(eventId)
         break
      case 'turn_over':
         gameContext.state.events.turnOver.delete(eventId)
         break
      case 'skill': {
         const sig = <SkillSignal>signal
         if (sig.skillId in gameContext.state.events.skillLearnt) {
            gameContext.state.events.skillLearnt[sig.skillId].delete(eventId)
         }
         break
      }
      case 'activity': {
         const sig = <ActivitySignal>signal
         if (sig.activityId in gameContext.state.events.activityPerformed) {
            gameContext.state.events.activityPerformed[sig.activityId].delete(eventId)
         }
         break
      }
      case 'player': {
         // TODO 需要重写
         break
      }
      case 'turns': {
         console.warn(
            '[W] [disconnect] 无法移除连接到了 \'turns\' 信号的事件，请使用 \'disconnectAll\''
         )
         break
      }
      case 'count_down': {
         console.warn(
            '[W] [disconnect] 无法移除连接到了 \'count_down\' 信号的事件，请使用 \'disconnectAll\''
         )
         break
      }
      case 'event': {
         const sig = <EventSignal>signal
         const sourceEventId = mEventId(ensureScope(gameContext), sig.eventId)
         if (gameContext.state.events.eventTriggered[sourceEventId]) {
            gameContext.state.events.eventTriggered[sourceEventId].delete(eventId)
         }
         break
      }
      default:
         console.warn(`[W] [disconnect] 无效的信号类型 '${signal.signalType}'`)
   }
}

// TODO(chuigda): implement disconnectAll

export default {
   signals,
   connect,
   disconnect
}
