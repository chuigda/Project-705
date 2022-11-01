import { GameContext } from '@app/executor/game_context'
import { triggerEventSeries } from '@app/executor/events'
import { PropertyOp } from '@app/ruleset/ops'
import { ValueSource } from '@app/ruleset/items/modifier'
import { PlayerProperty, PropertyId } from '@app/executor/game_context/player'
import { isDefined } from '@app/util/defined'
import { MaybeTranslationKey, mPropertyId, mTranslationKey } from '@app/base/uid'
import { ensureScope } from '@app/executor/game_context/scope'

export function initPropertySimple(
   gameContext: GameContext,
   propertyId: PropertyId,
   propertyName: MaybeTranslationKey,
   property: number
): PlayerProperty {
   return initProperty(gameContext, propertyId, {
      name: propertyName,
      value: property,
      min: 0
   })
}

export function initProperty(
   gameContext: GameContext,
   propertyId: PropertyId,
   property: PlayerProperty
): PlayerProperty {
   propertyId = mPropertyId(ensureScope(gameContext), propertyId)
   property.name = mTranslationKey(ensureScope(gameContext), property.name)

   if (gameContext.state.player.properties[propertyId]) {
      console.warn(`[W] [setProperty] property ${property} already initialised, will reset it`)
   }

   gameContext.state.player.properties[propertyId] = property
   gameContext.state.events.propertyUpdated[propertyId] = []
   gameContext.state.events.propertyOverflow[propertyId] = []
   gameContext.state.events.propertyUnderflow[propertyId] = []

   return property
}

export function getProperty(gameContext: GameContext, propertyId: PropertyId): PlayerProperty | undefined {
   propertyId = mPropertyId(ensureScope(gameContext), propertyId)
   return gameContext.state.player.properties[propertyId]
}

export function getPropertyValue(gameContext: GameContext, propertyId: PropertyId): number | undefined {
   propertyId = mPropertyId(ensureScope(gameContext), propertyId)
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
   value?: number,
   source?: ValueSource
) {
   propertyId = mPropertyId(ensureScope(gameContext), propertyId)

   if ((operator === 'add' || operator === 'sub') && !isDefined(value)) {
      console.error('[E] [updateProperty] cannot use \'add\' or \'sub\' without a valid value')
      return
   }
   value = value!

   if (value < 0 && operator === 'add') {
      operator = 'sub'
      value = -value
   } else if (value < 0 && operator === 'sub') {
      operator = 'add'
      value = -value
   }

   const property = getProperty(gameContext, propertyId)
   if (!property) {
      console.error(`[E] [updateProperty] property ${propertyId} does not exist yet`)
      return
   }

   if (source && (operator === 'add' || operator === 'sub')) {
      const allModifier = gameContext.state.computedModifier.getPlayerModifier('all', propertyId)
      const specificModifier = gameContext.state.computedModifier.getPlayerModifier(source, propertyId)
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
      value = Math.round(value * sumUpModifier)
   }

   const opRef = { operator, value }
   if (source) {
      triggerEventSeries(
         gameContext,
         gameContext.state.events.propertyUpdated.all,
         undefined,
         opRef,
         source
      )
      triggerEventSeries(
         gameContext,
         gameContext.state.events.propertyUpdated[propertyId],
         undefined,
         opRef,
         source
      )
   }

   switch (opRef.operator) {
      case 'add':
         property.value += opRef.value!
         break
      case 'sub':
         property.value -= opRef.value!
         break
      case 'set_max':
         property.max = opRef.value
         break
      case 'set_min':
         property.min = opRef.value
         break
      case 'set_incr':
         property.increment = opRef.value
         break
      case 'add_incr':
         property.increment = (property.increment ?? 0) + opRef.value
         break
      case 'sub_incr':
         property.increment = (property.increment ?? 0) - opRef.value
         break
      default:
         console.warn(`[W] [updatePlayerProperty] invalid operator '${opRef.operator}'`)
   }

   if (isDefined(property.min) && property.value > property.max!) {
      const diff = property.value - property.max!
      triggerEventSeries(
         gameContext,
         gameContext.state.events.propertyOverflow[propertyId],
         undefined,
         opRef,
         source,
         diff
      )
      property.value = property.max!
   } else if (isDefined(property.min) && property.value < property.min!) {
      const diff = property.min! - property.value
      triggerEventSeries(
         gameContext,
         gameContext.state.events.propertyUnderflow[propertyId],
         undefined,
         opRef,
         source,
         diff
      )
      property.value = property.min!
   }

   gameContext.updateTracker.player.properties = true
}

const propertyFunctions = {
   initPropertySimple,
   initProperty,
   getProperty,
   getPropertyValue,
   updateProperty
}

export default propertyFunctions
