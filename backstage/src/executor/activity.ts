import { Ident, mActivityId } from '@app/base/uid'
import { ensureScope } from '@app/executor/base'
import { GameContext } from '@app/executor/game_context'
import { updatePlayerProperty } from '@app/executor/properties'
import { PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
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
         updatePlayerProperty(gameContext, 'mentalHealth', 'sub', mentalHealth, propertySource)
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
   return [true]
}

const activityFunctions = {
   addActivity,
   performActivity
}

export default activityFunctions
