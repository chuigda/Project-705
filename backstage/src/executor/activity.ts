import { Ident, mActivityId } from '@app/base/uid'
import { GameContext } from '@app/executor/game_context'
import { updatePlayerProperty } from '@app/executor/properties'
import { PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import { triggerEventSeries } from '@app/executor/events'
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
      const propertySource = `@activity:${activityContent.category}`
      if (attributes) {
         for (const attrName in attributes) {
            const attrValue = attributes[<keyof PlayerAttributesUpdate>attrName]
            if (attrValue) {
               updatePlayerProperty(gameContext, `attributes.${attrName}`, 'add', attrValue, propertySource)
            }
         }
      }

      if (skillPoints) {
         updatePlayerProperty(gameContext, 'skillPoints', 'add', skillPoints, propertySource)
      }

      if (mentalHealth) {
         updatePlayerProperty(gameContext, 'pressure', 'add', mentalHealth, propertySource)
      }

      if (satisfactory) {
         updatePlayerProperty(gameContext, 'satisfactory', 'add', satisfactory, propertySource)
      }

      if (money) {
         updatePlayerProperty(gameContext, 'money', 'add', money, propertySource)
      }

      recomputeSkillCosts(gameContext)
   }

   triggerEventSeries(gameContext, activityContent.events, activityContent.scope)
}

const activityFunctions = {
   performActivity
}

export default activityFunctions
