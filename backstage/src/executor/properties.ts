import { GameContext } from '@app/executor/game_context'
import { triggerEvent } from '@app/executor/events'
import { PropertyOp } from '@app/ruleset/ops'
import { ValueSource } from '@app/ruleset/items/modifier'
import { ComputedPlayerModifier } from '@app/executor/compute'
import { PlayerProperty, PropertyId } from '@app/executor/game_context/player'

export function initProperty(
   gameContext: GameContext,
   propertyId: PropertyId,
   property: PlayerProperty | number
) {
   if (gameContext.state.player.properties[propertyId]) {
      console.warn(`[W] [setProperty] property ${property} already added, will reset it`)
   }

   if (typeof property === 'number') {
      gameContext.state.player.properties[propertyId] = { value: 0, min: 0 }
   } else {
      gameContext.state.player.properties[propertyId] = property
   }
}

export function getProperty(gameContext: GameContext, propertyId: PropertyId): PlayerProperty | undefined {
   return gameContext.state.player.properties[propertyId]
}

export function getPropertyValue(gameContext: GameContext, propertyId: PropertyId): number | undefined {
   const property = getProperty(gameContext, propertyId)
   if (!property) {
      return undefined
   }

   return property.value
}

export function updateProperty(
   gameContext: GameContext,
   propertyId: PropertyId,
   operator: PropertyOp,
   value: number,
   source?: ValueSource
) {
   if (operator === 'add' || operator === 'sub') {
      // TODO(chuigda): actually incomplete and ugly code, needs much refinement
      const playerModifierAll: ComputedPlayerModifier | undefined = gameContext.state.computedModifier!.player.all
      let playerModifier: ComputedPlayerModifier | undefined
      if (source) {
         playerModifier = gameContext.state.computedModifier!.player[source]
      } else {
         playerModifier = undefined
      }

      const allModifier = gameContext.state.computedModifier!.getPlayerModifier('all', propertyId)
      const specificModifier = playerModifier ? playerModifier[propertyId]! : undefined
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

   // TODO(chuigda): I almost forgot the logic of these things
   const opRef = { operator, value }
   const propertyPath = property.split('.')
   let container: Record<string, any> = gameContext.state.events.propertyUpdated
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

   if (container) {
      for (const event of Object.values(container)) {
         triggerEvent(gameContext, event, opRef, source)
      }
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
   initProperty,
   getProperty,
   getPropertyValue,
   updateProperty
}
