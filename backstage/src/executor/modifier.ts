import { GameContext } from '@app/executor/game_context'
import { Ident, mModifierId } from '@app/base/uid'
import { computeModifier } from '@app/executor/compute'

export function addModifier(gameContext: GameContext, modifier: Ident) {
   const modifierId = mModifierId(gameContext.scope!, modifier)
   if (!gameContext.ruleSet.modifiers[modifierId]) {
      console.error(`[E] [addModifier] modifier '${modifierId}' does not exist`)
      return
   }

   gameContext.state.modifiers.add(modifierId)
   computeModifier(gameContext)
}

export function removeModifier(gameContext: GameContext, modifier: Ident) {
   const modifierId = mModifierId(gameContext.scope!, modifier)
   if (!gameContext.ruleSet.modifiers[modifierId]) {
      console.error(`[E] [addModifier] modifier '${modifierId}' does not exist`)
      return
   }

   gameContext.state.modifiers.delete(modifierId)
   computeModifier(gameContext)
}

const modifierFunctions = { addModifier, removeModifier }

export default modifierFunctions
