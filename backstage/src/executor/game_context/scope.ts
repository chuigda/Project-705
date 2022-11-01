import { GameContext } from '@app/executor/game_context/index'
import { Scope } from '@app/base/uid'

export function pushScope(gameContext: GameContext, scope: Scope) {
   if (gameContext.scope) {
      gameContext.scopeChain.push(gameContext.scope)
   }
   gameContext.scope = scope
}

export function popScope(gameContext: GameContext) {
   if (gameContext.scopeChain.length === 0) {
      gameContext.scope = undefined
      return
   }

   gameContext.scope = gameContext.scopeChain.pop()
}

export function ensureScope(gameContext: GameContext, inputScope?: Scope): Scope {
   if (gameContext.scope) {
      return gameContext.scope
   }

   if (inputScope) {
      return inputScope
   }

   return { author: 'cnpr', moduleName: 'core' }
}

const scopeFunctions = {
   pushScope,
   popScope
}

export default scopeFunctions
