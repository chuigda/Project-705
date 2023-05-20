import { GameContext } from '@app/core/game_context'
import { LogicOp } from '@app/core/ruleset/ops'
import { MaybeTranslatable } from '@app/core/base/translation'

/// 组合逻辑算子
export interface PotentialExpressionLogicOp {
   /// 所进行的逻辑操作
   readonly op: LogicOp

   /// 参数列表
   readonly arguments: PotentialExpression[]
}

export type PotentialExpressionFunction = (gameContext: GameContext) => boolean

/// 函数算子
export interface PotentialExpressionFunctionOp {
   /// 所运行的函数
   readonly op: PotentialExpressionFunction

   /// 对算子的文本描述
   readonly description: MaybeTranslatable

   /// 只要有一次这个条件被判定为 false，那么就假定整个 potential expression 永远为 false，用于优化
   readonly onceFalse?: boolean
}

/// 需求表达式
///
/// 用于表示进行某一项活动（学习技能/激活飞升等）所需的前置条件。
export type PotentialExpression = PotentialExpressionLogicOp | PotentialExpressionFunctionOp

export function isPotentialExpressionLogicOp(expr: PotentialExpression): boolean {
   return typeof expr.op === 'string'
}

export function isPotentialExpressionFunctionOp(expr: PotentialExpression): boolean {
   return typeof expr.op === 'function'
}
