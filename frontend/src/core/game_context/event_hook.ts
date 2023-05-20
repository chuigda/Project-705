import { PropertyId } from './player'

export type TimedEventTrigger = 'turn_start' | 'turn_over'

/// 定时事件
export class TimedEvent {
   /// 在哪个回合触发
   turn: number

   /// 要执行的事件 id
   eventId: string

   /// 在会合开始时或是结束时执行
   trigger: TimedEventTrigger

   constructor(turn: number, eventId: string, trigger: TimedEventTrigger) {
      this.turn = turn
      this.eventId = eventId
      this.trigger = trigger
   }
}

/// 事件钩子
export class EventHooks {
   /// 回合开始时执行的事件
   turnStart: Set<string> = new Set()

   /// 回合结束时执行的事件
   turnOver: Set<string> = new Set()

   /// 习得技能时执行的事件，key 是技能 id
   skillLearnt: Record<string, Set<string>> = {}

   /// 进行活动时执行的事件，key 是活动 id
   activityPerformed: Record<string, Set<string>> = {}

   /// 当有其他事件被触发时要执行的事件，key 是事件 id
   eventTriggered: Record<string, Set<string>> = {}

   /// 定时事件
   timedEvents: TimedEvent[] = []

   /// 有属性被更新时触发的事件
   propertyUpdated: Record<PropertyId | 'all', string[]> = {}

   /// 属性上溢（`value` 超过 `max`）时触发的事件
   propertyOverflow: Record<PropertyId | 'all', string[]> = {}

   /// 属性下溢（`value` 低于 `min`）时触发的事件
   propertyUnderflow: Record<PropertyId | 'all', string[]> = {}
}
