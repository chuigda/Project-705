const { activityId, skillId } = require('../base/uid')
const { recomputeSkillCosts } = require('./compute')
const { updatePlayerProperty } = require('./properties')
const { pushScope, popScope, triggerEvent } = require('./events')

const executeSkillEffects = (gameContext, skillContent) => {
   if (skillContent.output) {
      for (const dimension in skillContent.output.attributes) {
         updatePlayerProperty(
            gameContext,
            `attributes.${dimension}`,
            'add',
            skillContent.output.attributes[dimension],
            '@learn_skill'
         )
      }
   }

   if (skillContent.activities) {
      for (const activity of skillContent.activities) {
         const absoluteActivityId = activityId(gameContext.scope, activity)
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

   recomputeSkillCosts(gameContext)
}

const learnSkill = (gameContext, skill) => {
   const absoluteSkillId = skillId(gameContext.scope, skill)
   if (!gameContext.computedSkills[absoluteSkillId]) {
      console.error(`[E] [learnSkill] skill '${absoluteSkillId}' is not available`)
      return
   }

   if (gameContext.player.skills[absoluteSkillId]) {
      console.warn(`[W] [learnSkill] skill '${absoluteSkillId}' has already been learnt, re-learning`)
   }

   const { skill: skillContent, cost } = gameContext.computedSkills[absoluteSkillId]
   gameContext.computedSkills[absoluteSkillId] = undefined

   gameContext.player.skills[absoluteSkillId] = skillContent
   gameContext.player.skillPoints -= cost

   executeSkillEffects(gameContext, skillContent)
}

const grantSkill = (gameContext, skill) => {
   const absoluteSkillId = skillId(gameContext.scope, skill)
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

module.exports = {
   learnSkill,
   grantSkill
}
