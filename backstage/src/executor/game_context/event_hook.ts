import { PropertyId } from './player'

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

   propertyUpdated: Record<PropertyId | 'all', string[]> = {}
   propertyOverflow: Record<PropertyId | 'all', string[]> = {}
   propertyUnderflow: Record<PropertyId | 'all', string[]> = {}
}
