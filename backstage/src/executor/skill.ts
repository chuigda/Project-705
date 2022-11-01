import { Ident, mActivityId, mSkillId } from '@app/base/uid'
import { Skill } from '@app/ruleset/items/skill'
import { ensureScope } from '@app/executor/game_context/scope'
import { triggerEventSeries } from '@app/executor/events'
import { recomputeSkillCosts } from '@app/executor/compute'
import { GameContext } from '@app/executor/game_context'
import { updateProperty } from '@app/executor/property'
import { concatMessage, QResult } from '@app/executor/result'

function executeSkillEffects(gameContext: GameContext, skillContent: Skill): QResult {
   const scope = ensureScope(gameContext)
   gameContext.updateTracker.player.skills = true

   if (skillContent.output) {
      for (const propertyId in skillContent.output) {
         updateProperty(
            gameContext,
            propertyId,
            'add',
            skillContent.output[propertyId],
            '@learn_skill'
         )
      }
   }

   if (skillContent.activities) {
      gameContext.updateTracker.player.skills = true
      for (const activity of skillContent.activities) {
         const absoluteActivityId = mActivityId(scope, activity)
         gameContext.state.player.activities[absoluteActivityId] = gameContext.ruleSet.activities[absoluteActivityId]
      }
   }

   let warnMessage
   const [_s, message] = triggerEventSeries(gameContext, skillContent.events, scope)
   warnMessage = concatMessage(warnMessage, message)

   for (const eventIds of Object.values(gameContext.state.events.skillLearnt)) {
      const [_s1, message1] = triggerEventSeries(gameContext, [...eventIds])
      warnMessage = concatMessage(warnMessage, message1)
   }

   delete gameContext.skillPool[<string>skillContent.ident]
   recomputeSkillCosts(gameContext)

   return [true, warnMessage]
}

export function learnSkill(gameContext: GameContext, skill: Ident): QResult {
   const scope = ensureScope(gameContext)
   const skillId = mSkillId(scope, skill)
   if (!gameContext.state.computedSkills!.available[skillId]) {
      const errMessage = `skill '${skillId}' is not available`
      console.error(`[E] [learnSkill] ${errMessage}`)
      return [false, errMessage]
   }

   console.info(`[I] [learnSkill] learning skill '${skillId}'`)

   let warnMessage
   if (gameContext.state.player.skills[skillId]) {
      const message = `skill '${skillId}' has already been learnt, re-learning`
      console.warn(`[W] [learnSkill] ${message}`)
      warnMessage = concatMessage(warnMessage, message)
   }

   const { skill: skillContent, cost } = gameContext.state.computedSkills!.available[skillId]
   delete gameContext.state.computedSkills!.available[skillId]

   gameContext.state.player.skills[skillId] = skillContent
   gameContext.updateProperty('skillPoints', 'sub', cost, '@learn_skill')

   const [success, message] = executeSkillEffects(gameContext, skillContent)
   warnMessage = concatMessage(warnMessage, message)

   return [true, warnMessage]
}

export function grantSkill(gameContext: GameContext, skill: Ident, force?: boolean): QResult {
   const scope = ensureScope(gameContext)
   const skillId = mSkillId(scope, skill)
   let skillContent
   if (force) {
      skillContent = gameContext.ruleSet.skills[skillId]
      if (!skillContent) {
         const errMessage = `skill '${skillId}' does not exist`
         console.error(`[E] [grantSkill] ${errMessage}`)
         return [false, errMessage]
      }
   } else {
      const availableSkill = gameContext.state.computedSkills!.available[skillId]
      if (!availableSkill) {
         const errMessage = `skill '${skillId}' not available`
         console.error(`[E] [grantSkill] ${errMessage}`)
         return [false, errMessage]
      }
      skillContent = availableSkill.skill
   }

   console.info(`[I] [grantSkill] granting skill '${skillId}'`)

   let warnMessage
   if (gameContext.state.player.skills[skillId]) {
      const message = `skill '${skillId}' has already been learnt or granted, re-granting`
      console.warn(`[W] [grantSkill] ${message}`)
      warnMessage = concatMessage(warnMessage, message)
   }

   gameContext.state.player.skills[skillId] = skillContent

   const [success, message] = executeSkillEffects(gameContext, skillContent)
   warnMessage = concatMessage(warnMessage, message)

   return [true, warnMessage]
}

export default {
   learnSkill,
   grantSkill
}
