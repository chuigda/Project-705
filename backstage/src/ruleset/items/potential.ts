import { GameContext } from '@app/executor/game_context'
import { LogicOp } from '@app/ruleset/ops'
import { MaybeTranslatable } from '@app/base/translation'

export interface PotentialExpressionLogicOp {
   readonly op: LogicOp
   readonly arguments: PotentialExpression[]
}

export type PotentialExpressionFunction = (gameContext: GameContext) => boolean

export interface PotentialExpressionFunctionOp {
   readonly op: PotentialExpressionFunction
   readonly description: MaybeTranslatable

   /// 只要有一次这个条件被判定为 false，那么就假定整个 potential expression 永远为 false，用于优化
   readonly onceFalse?: boolean
}

export type PotentialExpression = PotentialExpressionLogicOp | PotentialExpressionFunctionOp

export function isPotentialExpressionLogicOp(expr: PotentialExpression): boolean {
   return typeof expr.op === 'string'
}

export function isPotentialExpressionFunctionOp(expr: PotentialExpression): boolean {
   return typeof expr.op === 'function'
}
