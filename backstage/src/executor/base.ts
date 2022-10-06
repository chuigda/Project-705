import { GameContext } from '@app/executor/game_context'
import { Scope } from '@app/base/uid'

export function ensureScope(gameContext: GameContext, inputScope?: Scope): Scope {
   if (inputScope) {
      return inputScope
   }

   if (gameContext.scope) {
      return gameContext.scope
   }

   return { author: 'cnpr', moduleName: 'core' }
}
