import { GameContext } from '@app/executor/game_context'
import { Ident, mVarName, Scope } from '@app/base/uid'

export function getVar(gameContext: GameContext, varName: Ident): any {
   const absoluteVarName = mVarName(<Scope>gameContext.scope, varName)
   return gameContext.variables[absoluteVarName]
}

export function setVar(gameContext: GameContext, varName: Ident, value: any): void {
   const absoluteVarName = mVarName(<Scope>gameContext.scope, varName)
   if (value === undefined) {
      delete gameContext.variables[absoluteVarName]
   } else {
      gameContext.variables[absoluteVarName] = value
   }
}

export default {
   getVar,
   setVar
}
