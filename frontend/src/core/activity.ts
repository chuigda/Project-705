import { Ident, mActivityId } from '@app/core/base/uid'
import { ensureScope } from '@app/core/game_context/scope'
import { GameContext } from '@app/core/game_context'
import { updateProperty } from '@app/core/property'
import { triggerEventSeries } from '@app/core/events'
import { recomputeSkillCosts } from '@app/core/compute'

export function addActivity(gameContext: GameContext, activity: Ident): void {
   const scope = ensureScope(gameContext)
   const activityId = mActivityId(scope, activity)
   const activityContent = gameContext.ruleSet.activities[activityId]
   if (!activityContent) {
      throw new Error(`[E] [addActivity] 活动 '${activityId}' 不存在`)
   }

   if (gameContext.state.player.activities[activityId]) {
      console.warn(`[W] [addActivity] 已经拥有了活动 '${activityId}'`)
   }

   gameContext.state.player.activities[activityId] = activityContent
}

export function performActivity(gameContext: GameContext, activity: Ident): void {
   const scope = ensureScope(gameContext)
   const activityId = mActivityId(scope, activity)
   if (!gameContext.state.player.activities[activityId]) {
      throw new Error(`[E] [performActivity] 活动 '${activityId} 当前不可用`)
   }
   const activityContent = gameContext.state.player.activities[activityId]

   updateProperty(
      gameContext,
      'energy',
      'sub',
      activityContent.energyCost,
      '@activity'
   )

   if (activityContent.output) {
      for (const propertyId in activityContent.output) {
         updateProperty(
            gameContext,
            propertyId,
            'add',
            activityContent.output[propertyId],
            '@activity'
         )
      }

      recomputeSkillCosts(gameContext)
   }

   triggerEventSeries(gameContext, activityContent.events, activityContent.scope)
}

const activityFunctions = { addActivity }

export default activityFunctions
