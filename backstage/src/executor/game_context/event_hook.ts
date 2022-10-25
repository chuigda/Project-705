import { PropertyId } from './player'

export type PlayerPropertyEventHooks = Record</* source */string, /* event id */string>

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

   propertyUpdated: Record<PropertyId | 'all', PlayerPropertyEventHooks>
   propertyOverflow: Record<PropertyId | 'all', PlayerPropertyEventHooks>
   propertyUnderflow: Record<PropertyId | 'all', PlayerPropertyEventHooks>
}
