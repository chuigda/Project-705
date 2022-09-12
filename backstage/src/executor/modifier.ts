import { GameContext } from '@app/executor/game_context'
import { Ident, mModifierId } from '@app/base/uid'
import { computeModifier, recomputeSkillCosts } from '@app/executor/compute'

export function addModifier(gameContext: GameContext, modifier: Ident) {
   const modifierId = mModifierId(gameContext.scope!, modifier)
   if (!gameContext.ruleSet.modifiers[modifierId]) {
      console.error(`[E] [addModifier] modifier '${modifierId}' does not exist`)
      return
   }

   console.info(`[I] [addModifier] adding modifier '${modifierId}'`)
   gameContext.state.modifiers.add(modifierId)
   gameContext.updateTracker.modifiers = true
   computeModifier(gameContext)
   recomputeSkillCosts(gameContext)
}

export function removeModifier(gameContext: GameContext, modifier: Ident) {
   const modifierId = mModifierId(gameContext.scope!, modifier)
   if (!gameContext.ruleSet.modifiers[modifierId]) {
      console.error(`[E] [addModifier] modifier '${modifierId}' does not exist`)
      return
   }

   console.info(`[I] [addModifier] removing modifier '${modifierId}'`)
   gameContext.state.modifiers.delete(modifierId)
   gameContext.updateTracker.modifiers = true
   computeModifier(gameContext)
   recomputeSkillCosts(gameContext)
}

const modifierFunctions = { addModifier, removeModifier }

export default modifierFunctions
