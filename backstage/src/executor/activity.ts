import { Ident, mActivityId } from '@app/base/uid'
import { GameContext } from '@app/executor/game_context'
import { updatePlayerProperty } from '@app/executor/properties'
import { PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import { popScope, pushScope, triggerEvent } from '@app/executor/events'
import { recomputeSkillCosts } from '@app/executor/compute'

export function performActivity(gameContext: GameContext, activity: Ident) {
   const scope = gameContext.scope!
   const activityId = mActivityId(scope, activity)
   if (!gameContext.state.player.activities[activityId]) {
      console.error(`[E] [performActivity] activity '${activityId} is not available`)
      return
   }
   const activityContent = gameContext.state.player.activities[activityId]

   updatePlayerProperty(
      gameContext,
      'energy',
      'sub',
      activityContent.energyCost,
      '@activity'
   )

   if (activityContent.output) {
      const { attributes, skillPoints, mentalHealth, satisfactory, money } = activityContent.output
      if (attributes) {
         for (const attrName in attributes) {
            const attrValue = attributes[<keyof PlayerAttributesUpdate>attrName]
            if (attrValue) {
               updatePlayerProperty(
                  gameContext,
                  `attributes.${attrName}`,
                  'add',
                  attrValue,
                  '@activity'
               )
            }
         }
      }

      if (skillPoints) {
         updatePlayerProperty(gameContext, 'skillPoints', 'add', skillPoints, '@activity')
      }

      if (mentalHealth) {
         updatePlayerProperty(gameContext, 'pressure', 'add', mentalHealth, '@activity')
      }

      if (satisfactory) {
         updatePlayerProperty(gameContext, 'satisfactory', 'add', satisfactory, '@activity')
      }

      if (money) {
         updatePlayerProperty(gameContext, 'money', 'add', money, '@activity')
      }

      recomputeSkillCosts(gameContext)
   }

   if (activityContent.events) {
      if (activityContent.scope) {
         pushScope(gameContext, activityContent.scope)
      }

      for (const event of activityContent.events) {
         triggerEvent(gameContext, event)
      }

      if (activityContent.scope) {
         popScope(gameContext)
      }
   }
}

const activityFunctions = {
   performActivity
}

export default activityFunctions
