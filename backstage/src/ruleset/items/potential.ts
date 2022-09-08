import { GameContext } from '@app/executor/game_context'
import { MaybeTranslationKey } from '@app/base/uid'
import { LogicOp } from '@app/ruleset/ops'

export interface PotentialExpressionLogicOp {
   readonly op: LogicOp
   readonly arguments: PotentialExpression[]
}

export type PotentialExpressionFunction = (gameContext: GameContext) => boolean

export interface PotentialExpressionFunctionOp {
   readonly op: PotentialExpressionFunction
   readonly description: MaybeTranslationKey
}

export type PotentialExpression = PotentialExpressionLogicOp | PotentialExpressionFunctionOp
