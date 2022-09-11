import { Ident, mActivityId, mSkillId } from '@app/base/uid'
import { Skill } from '@app/ruleset/items/skill'
import { pushScope, triggerEvent, popScope } from '@app/executor/events'
import { recomputeSkillCosts } from '@app/executor/compute'
import { GameContext, PlayerAttributes } from '@app/executor/game_context'
import { updatePlayerProperty } from '@app/executor/properties'

function executeSkillEffects(gameContext: GameContext, skillContent: Skill) {
   const scope = gameContext.scope!

   gameContext.updateTracker.player.skills = true

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
      gameContext.updateTracker.player.skills = true
      for (const activity of skillContent.activities) {
         const absoluteActivityId = mActivityId(scope, activity)
         gameContext.state.player.activities[absoluteActivityId] = gameContext.ruleSet.activities[absoluteActivityId]
      }
   }

   if (skillContent.events) {
      pushScope(gameContext, scope)
      for (const event of skillContent.events) {
         triggerEvent(gameContext, event)
      }
      popScope(gameContext)
   }

   for (const eventIds of Object.values(gameContext.state.events.skillLearnt)) {
      for (const eventId of eventIds) {
         triggerEvent(gameContext, eventId, skillContent.ident)
      }
   }

   recomputeSkillCosts(gameContext)
}

export function learnSkill(gameContext: GameContext, skill: Ident) {
   const scope = gameContext.scope!
   const skillId = mSkillId(scope, skill)
   if (!gameContext.state.computedSkills!.available[skillId]) {
      console.error(`[E] [learnSkill] skill '${skillId}' is not available`)
      return
   }

   if (gameContext.state.player.skills[skillId]) {
      console.warn(`[W] [learnSkill] skill '${skillId}' has already been learnt, re-learning`)
   }

   const { skill: skillContent, cost } = gameContext.state.computedSkills!.available[skillId]
   delete gameContext.state.computedSkills!.available[skillId]

   gameContext.state.player.skills[skillId] = skillContent
   gameContext.updatePlayerProperty('skillPoints', 'sub', cost, '@learn_skill')

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

   if (gameContext.state.player.skills[skillId]) {
      console.warn(`[W] [grantSkill] skill '${skillId}' has already been learnt, re-granting`)
   }
   gameContext.state.player.skills[skillId] = skillContent

   executeSkillEffects(gameContext, skillContent)
}

export default {
   learnSkill,
   grantSkill
}
