import { Ident, mActivityId, mSkillId } from '@app/base/uid'
import { Skill } from '@app/ruleset/items/skill'
import { pushScope, triggerEvent, popScope } from '@app/executor/events'
import { recomputeSkillCosts } from '@app/executor/compute'
import { GameContext, PlayerAttributes } from '@app/executor/game_context'
import { updatePlayerProperty } from '@app/executor/properties'

function executeSkillEffects(gameContext: GameContext, skillContent: Skill) {
   const scope = gameContext.scope!

   if (skillContent.output) {
      let dimension: keyof PlayerAttributes
      if (skillContent.output && skillContent.output.attributes) {
         for (dimension in skillContent.output.attributes) {
            updatePlayerProperty(
               gameContext,
               `attributes.${dimension}`,
               'add',
               skillContent.output.attributes[dimension] as number,
               '@learn_skill'
            )
         }
      }
   }

   if (skillContent.activities) {
      for (const activity of skillContent.activities) {
         const absoluteActivityId = mActivityId(scope, activity)
         gameContext.player.activities[absoluteActivityId] = gameContext.ruleSet.activities[absoluteActivityId]
      }
   }

   if (skillContent.events) {
      pushScope(gameContext, scope)
      for (const event of skillContent.events) {
         triggerEvent(gameContext, event)
      }
      popScope(gameContext)
   }

   for (const eventIds of Object.values(gameContext.events.skillLearnt)) {
      for (const eventId of eventIds) {
         triggerEvent(gameContext, eventId, skillContent.ident)
      }
   }

   recomputeSkillCosts(gameContext)
}

export function learnSkill(gameContext: GameContext, skill: Ident) {
   const scope = gameContext.scope!
   const skillId = mSkillId(scope, skill)
   if (!gameContext.computedSkills!.available[skillId]) {
      console.error(`[E] [learnSkill] skill '${skillId}' is not available`)
      return
   }

   if (gameContext.player.skills[skillId]) {
      console.warn(`[W] [learnSkill] skill '${skillId}' has already been learnt, re-learning`)
   }

   const { skill: skillContent, cost } = gameContext.computedSkills!.available[skillId]
   delete gameContext.computedSkills!.available[skillId]

   gameContext.player.skills[skillId] = skillContent
   gameContext.player.skillPoints -= cost

   executeSkillEffects(gameContext, skillContent)
}

export function grantSkill(gameContext: GameContext, skill: Ident) {
   const scope = gameContext.scope!
   const skillId = mSkillId(scope, skill)
   const skillContent = gameContext.ruleSet.skills[skillId]

   if (!skillContent) {
      console.error(`[E] [grantSkill] skill '${skillId}' does not exist`)
      return
   }

   if (gameContext.player.skills[skillId]) {
      console.warn(`[W] [grantSkill] skill '${skillId}' has already been learnt, re-granting`)
   }
   gameContext.player.skills[skillId] = skillContent

   executeSkillEffects(gameContext, skillContent)
}
