import { Ident, mActivityId } from '@app/base/uid'
import { ensureScope } from '@app/executor/game_context/scope'
import { GameContext } from '@app/executor/game_context'
import { updateProperty } from '@app/executor/property'
import { triggerEventSeries } from '@app/executor/events'
import { recomputeSkillCosts } from '@app/executor/compute'
import { QResult } from '@app/executor/result'

export function addActivity(gameContext: GameContext, activity: Ident): QResult {
   const scope = ensureScope(gameContext)
   const activityId = mActivityId(scope, activity)
   const activityContent = gameContext.ruleSet.activities[activityId]
   if (!activityContent) {
      const errMessage = `${activityId} does not exist`
      console.error(`[E] [addActivity] activity ${errMessage}`)
      return [false, errMessage]
   }

   if (gameContext.state.player.activities[activityId]) {
      const warnMessage = `activity ${activityId} already exists`
      console.warn(`[W] [addActivity] ${warnMessage}`)
      return [true, warnMessage]
   }

   gameContext.state.player.activities[activityId] = activityContent
   return [true]
}

export function performActivity(gameContext: GameContext, activity: Ident): QResult {
   const scope = ensureScope(gameContext)
   const activityId = mActivityId(scope, activity)
   if (!gameContext.state.player.activities[activityId]) {
      const errMessage = `activity '${activityId} is not available`
      console.error(`[E] [performActivity] ${errMessage}`)
      return [false, errMessage]
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
         updateProperty(gameContext, propertyId, 'add', activityContent.output[propertyId], '@activity')
      }

      recomputeSkillCosts(gameContext)
   }

   triggerEventSeries(gameContext, activityContent.events, activityContent.scope)
   return [true]
}

const activityFunctions = { addActivity }

export default activityFunctions
