import { GameContext } from '@app/core/game_context'
import { Ident, mVarName } from '@app/core/base/uid'
import { ensureScope } from '@app/core/game_context/scope'

export function getVar(gameContext: GameContext, varName: Ident): any {
   const absoluteVarName = mVarName(ensureScope(gameContext), varName)
   return gameContext.state.variables[absoluteVarName]
}

export function setVar(gameContext: GameContext, varName: Ident, value: any): any {
   const absoluteVarName = mVarName(ensureScope(gameContext), varName)
   const oldValue = gameContext.state.variables[absoluteVarName]
   if (value === undefined) {
      delete gameContext.state.variables[absoluteVarName]
   } else {
      gameContext.state.variables[absoluteVarName] = value
   }
   return oldValue
}

export function updateVar(gameContext: GameContext, varName: Ident, updater: (v: any) => any): any {
   const absoluteVarName = mVarName(ensureScope(gameContext), varName)
   const oldValue = gameContext.state.variables[absoluteVarName]
   const newValue = updater(oldValue)
   if (newValue === undefined) {
      delete gameContext.state.variables[absoluteVarName]
   } else {
      gameContext.state.variables[absoluteVarName] = newValue
   }
   return oldValue
}

export default {
   getVar,
   setVar,
   updateVar
}
