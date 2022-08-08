import { GameContext } from '@app/executor/game_context'
import { MaybeTranslationKey } from '@app/base/uid'
import { LogicOp } from '@app/ruleset/ops'

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
