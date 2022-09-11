import { GameContext } from '@app/executor/game_context'
import { triggerEvent } from '@app/executor/events'
import { PropertyOp } from '@app/ruleset/ops'
import { ValueSource } from '@app/ruleset/items/modifier'
import { ComputedPlayerModifier } from '@app/executor/compute'

export function updatePlayerProperty(
   gameContext: GameContext,
   property: string,
   operator: PropertyOp,
   value: number,
   source?: ValueSource
) {
   if (operator === 'add' || operator === 'sub') {
      const playerModifierAll: ComputedPlayerModifier | undefined = gameContext.state.computedModifier!.player.all
      let playerModifier: ComputedPlayerModifier | undefined
      if (source) {
         playerModifier = gameContext.state.computedModifier!.player[source]
      } else {
         playerModifier = undefined
      }

      const allModifier = playerModifierAll ? playerModifierAll.getModifier(property)! : undefined
      const specificModifier = playerModifier ? playerModifier.getModifier(property)! : undefined
      const gainOrLoss = operator === 'add' ? 'gain' : 'loss'

      let sumUpModifier = 1.0
      if (allModifier) {
         sumUpModifier += allModifier[gainOrLoss]
      }
      if (specificModifier) {
         sumUpModifier += specificModifier[gainOrLoss]
      }

      if (sumUpModifier < 0) {
         sumUpModifier = 0
      }
      value = Math.ceil(value * sumUpModifier)
   }

   const opRef = { operator, value }
   const propertyPath = property.split('.')
   let container: Record<string, any> = gameContext.state.events.playerPropertyUpdated
   let propertyContainer: Record<string, any> = gameContext.state.player
   for (const pathPartIdx in propertyPath) {
      const pathPart = propertyPath[pathPartIdx]
      if (container.all) {
         for (const event in container.all) {
            triggerEvent(gameContext, event, opRef, source)
         }
      }
      container = container[pathPart]
      if (typeof propertyContainer[pathPart] === 'object') {
         propertyContainer = propertyContainer[pathPart]
      }
   }
   const lastPropertyPath = propertyPath[propertyPath.length - 1]

   for (const event of Object.values(container)) {
      triggerEvent(gameContext, event, opRef, source)
   }

   switch (opRef.operator) {
      case 'add':
         propertyContainer[lastPropertyPath] += opRef.value
         break
      case 'sub':
         propertyContainer[lastPropertyPath] -= opRef.value
         break
      case 'set':
         propertyContainer[lastPropertyPath] = opRef.value
         break
      case 'mul':
         propertyContainer[lastPropertyPath] *= opRef.value
         break
      default:
         console.warn(`[W] [updatePlayerProperty] invalid operator '${opRef.operator}'`)
   }

   if (propertyContainer[lastPropertyPath] < 0) {
      propertyContainer[lastPropertyPath] = 0
   }

   gameContext.updateTracker.player.properties = true
}

export default {
   updatePlayerProperty
}
