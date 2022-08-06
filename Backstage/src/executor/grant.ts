import { Ident, mActivityId, mSkillId } from 'base/uid'
import { Skill } from 'ruleset/items/skill'
import { pushScope, triggerEvent, popScope } from './events'
import { recomputeSkillCosts } from './compute'
import { GameContext, PlayerAttributes } from './game_context'
import { updatePlayerProperty } from './properties'

function executeSkillEffects(gameContext: GameContext, skillContent: Skill) {
   if (skillContent.output) {
      let dimension: keyof PlayerAttributes
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

   if (skillContent.activities) {
      for (const activity of skillContent.activities) {
         const absoluteActivityId = mActivityId(gameContext.scope, activity)
         gameContext.player.activities[absoluteActivityId] = gameContext.ruleSet.activities[absoluteActivityId]
      }
   }

   if (skillContent.events) {
      pushScope(gameContext, skillContent.scope)
      for (const event of skillContent.events) {
         triggerEvent(gameContext, event)
      }
      popScope(gameContext)
   }

   for (const eventIds of Object.values(gameContext.events.skillLearnt)) {
      for (const eventId of eventIds) {
         const event = gameContext.ruleSet.events[eventId]
         pushScope(gameContext, event.scope)
         event.event.forEach((e) => triggerEvent(gameContext, e, skillContent.ident))
         popScope(gameContext)
      }
   }

   recomputeSkillCosts(gameContext)
}

export function learnSkill(gameContext: GameContext, skill: Ident) {
   const absoluteSkillId = mSkillId(gameContext.scope, skill)
   if (!gameContext.computedSkills.available[absoluteSkillId]) {
      console.error(`[E] [learnSkill] skill '${absoluteSkillId}' is not available`)
      return
   }

   if (gameContext.player.skills[absoluteSkillId]) {
      console.warn(`[W] [learnSkill] skill '${absoluteSkillId}' has already been learnt, re-learning`)
   }

   const { skill: skillContent, cost } = gameContext.computedSkills.available[absoluteSkillId]
   delete gameContext.computedSkills.available[absoluteSkillId]

   gameContext.player.skills[absoluteSkillId] = skillContent
   gameContext.player.skillPoints -= cost

   executeSkillEffects(gameContext, skillContent)
}

export function grantSkill(gameContext: GameContext, skill: Ident) {
   const absoluteSkillId = mSkillId(gameContext.scope, skill)
   const skillContent = gameContext.ruleSet.skills[absoluteSkillId]

   if (!skillContent) {
      console.error(`[E] [grantSkill] skill '${absoluteSkillId}' does not exist`)
      return
   }

   if (gameContext.player.skills[absoluteSkillId]) {
      console.warn(`[W] [grantSkill] skill '${absoluteSkillId}' has already been learnt, re-granting`)
   }
   gameContext.player.skills[absoluteSkillId] = skillContent

   executeSkillEffects(gameContext, skillContent)
}
