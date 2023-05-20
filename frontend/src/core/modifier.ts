import { GameContext } from '@app/core/game_context'
import { Ident, mModifierId } from '@app/core/base/uid'
import { computeModifier, recomputeSkillCosts } from '@app/core/compute'
import { ensureScope } from '@app/core/game_context/scope'

export function addModifier(gameContext: GameContext, modifier: Ident): void {
   const modifierId = mModifierId(ensureScope(gameContext), modifier)
   if (!gameContext.ruleSet.modifiers[modifierId]) {
      throw new Error(`[E] [addModifier] 修正 '${modifierId}' 不存在`)
   }

   console.info(`[I] [addModifier] 添加了修正项目 '${modifierId}'`)
   gameContext.state.modifiers.add(modifierId)
   computeModifier(gameContext)
   recomputeSkillCosts(gameContext)
}

export function removeModifier(gameContext: GameContext, modifier: Ident): void {
   const modifierId = mModifierId(ensureScope(gameContext), modifier)
   if (!gameContext.ruleSet.modifiers[modifierId]) {
      throw new Error(`[E] [addModifier] 修正 '${modifierId}' 不存在`)
   }

   console.info(`[I] [addModifier] 移除了修正项目 '${modifierId}'`)
   gameContext.state.modifiers.delete(modifierId)
   computeModifier(gameContext)
   recomputeSkillCosts(gameContext)
}

const modifierFunctions = { addModifier, removeModifier }

export default modifierFunctions
