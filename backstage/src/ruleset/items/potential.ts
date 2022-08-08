import { GameContext } from '../../executor/game_context'
import { MaybeTranslationKey } from '../../base/uid'
import { LogicOp } from '../ops'

export class PotentialExpressionLogicOp {
   readonly op: LogicOp
   readonly arguments: PotentialExpression[]

   constructor(op: LogicOp, args: PotentialExpression[]) {
      this.op = op
      this.arguments = args
   }
}

export type PotentialExpressionFunction = (gameContext: GameContext) => boolean

export class PotentialExpressionFunctionOp {
   readonly op: PotentialExpressionFunction
   readonly description: MaybeTranslationKey

   constructor(op: PotentialExpressionFunction, description: MaybeTranslationKey) {
      this.op = op
      this.description = description
   }
}

export type PotentialExpression = PotentialExpressionLogicOp | PotentialExpressionFunctionOp
