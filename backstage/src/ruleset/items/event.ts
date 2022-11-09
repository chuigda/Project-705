import { Ident, Scope } from '@app/base/uid'
import { GameContext } from '@app/executor/game_context'

/// 事件函数
///
/// 取决于触发事件的方式不同，事件函数在被调用时会收到不同类型的参数
// TODO 补齐这部分文档
export type EventFunction = (gameContext: GameContext, ...args: any[]) => void

/// 事件
///
/// Project-705 框架的核心概念之一。玩家进行的各种操作都会触发事件，更新 `GameContext`，从而与玩家产生一定互动效果。
export class Event {
   /// 事件的唯一标识符
   readonly ident: Ident

   /// 事件的作用域
   ///
   /// 在编写 MOD 时可以不填写此项目，规则集加载时会被自动设置为 MOD 的作用域
   readonly scope?: Scope

   /// 触发事件时所执行的函数
   readonly event: EventFunction
}

/// 可能是一个拥有标识的事件，也可能是一个“内联”事件
export type MaybeInlineEvent = Ident | EventFunction
