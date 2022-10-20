import { PropertyName } from "./player"

export type PlayerPropertyEventHooks = Record<string /*source*/, string /*event id*/>

export class TimedEvent {
   turn: number
   eventId: string
   trigger: 'turn_start' | 'turn_over'
}

export class EventHooks {
   turnStart: Set<string> = new Set()
   turnOver: Set<string> = new Set()
   skillLearnt: Record<string, Set<string>> = {}
   activityPerformed: Record<string, Set<string>> = {}
   eventTriggered: Record<string, Set<string>> = {}

   timedEvents: TimedEvent[] = []
   
   propertyUpdated: Record<PropertyName | 'all', PlayerPropertyEventHooks>
   propertyOverflow:  Record<PropertyName | 'all', PlayerPropertyEventHooks>
   propertyUnderflow:  Record<PropertyName | 'all', PlayerPropertyEventHooks>
}
