import { GameContext } from '@app/executor/game_context'
import { Ident, mModifierId } from '@app/base/uid'
import { computeModifier, recomputeSkillCosts } from '@app/executor/compute'
import { QResult } from '@app/executor/result'
import { ensureScope } from '@app/executor/game_context/scope'

export function addModifier(gameContext: GameContext, modifier: Ident): QResult {
   const modifierId = mModifierId(ensureScope(gameContext), modifier)
   if (!gameContext.ruleSet.modifiers[modifierId]) {
      const errMessage = `modifier '${modifierId}' does not exist`
      console.error(`[E] [addModifier] ${errMessage}`)
      return [false, errMessage]
   }

   console.info(`[I] [addModifier] adding modifier '${modifierId}'`)
   gameContext.state.modifiers.add(modifierId)
   gameContext.updateTracker.modifiers = true
   computeModifier(gameContext)
   recomputeSkillCosts(gameContext)

   return [true]
}

export function removeModifier(gameContext: GameContext, modifier: Ident): QResult {
   const modifierId = mModifierId(ensureScope(gameContext), modifier)
   if (!gameContext.ruleSet.modifiers[modifierId]) {
      const errMessage = `modifier '${modifierId}' does not exist`
      console.error(`[E] [addModifier] ${errMessage}`)
      return [false, errMessage]
   }

   console.info(`[I] [addModifier] removing modifier '${modifierId}'`)
   gameContext.state.modifiers.delete(modifierId)
   gameContext.updateTracker.modifiers = true
   computeModifier(gameContext)
   recomputeSkillCosts(gameContext)

   return [true]
}

const modifierFunctions = { addModifier, removeModifier }

export default modifierFunctions
