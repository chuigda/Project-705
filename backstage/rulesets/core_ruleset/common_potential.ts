import { PotentialExpressionFunctionOp } from '@app/ruleset/items/potential'
import { ComposedId, mStartupId } from '@app/base/uid'

export function turnsLater(turns: number): PotentialExpressionFunctionOp {
   return {
      op: gameContext => gameContext.state.turns >= turns,
      // using absolute translation key
      description: `@tr:$potential_turns_${turns}`
   }
}

export function requireStartup(startup: ComposedId, startupNickName: string): PotentialExpressionFunctionOp {
   return {
      op: gameContext => gameContext.state.startup === mStartupId(startup, startup),
      description: `$potential_startup_${startupNickName}`
   }
}

export function requireStartupNot(startup: ComposedId, startupNickName: string): PotentialExpressionFunctionOp {
   return {
      op: gameContext => gameContext.state.startup !== mStartupId(startup, startup),
      description: `$potential_not_startup_${startupNickName}`
   }
}
