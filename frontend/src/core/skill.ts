import { Ident, mActivityId, mSkillId } from '@app/core/base/uid'
import { Skill } from '@app/core/ruleset/items/skill'
import { ensureScope } from '@app/core/game_context/scope'
import { triggerEventSeries } from '@app/core/events'
import { recomputeSkillCosts } from '@app/core/compute'
import { GameContext } from '@app/core/game_context'
import { updateProperty } from '@app/core/property'

function executeSkillEffects(gameContext: GameContext, skill: Skill): void {
   const scope = ensureScope(gameContext)
   const skillId = <string>skill.ident

   if (skill.output) {
      for (const propertyId in skill.output) {
         updateProperty(
            gameContext,
            propertyId,
            'add',
            skill.output[propertyId],
            '@learn_skill'
         )
      }
   }

   if (skill.activities) {
      for (const activity of skill.activities) {
         const absoluteActivityId = mActivityId(scope, activity)
         gameContext.state.player.activities[absoluteActivityId] = gameContext.ruleSet.activities[absoluteActivityId]
      }
   }

   triggerEventSeries(gameContext, skill.events, scope)
   triggerEventSeries(gameContext, [...gameContext.state.events.skillLearnt[skillId]])

   delete gameContext.skillPool[skillId]
   recomputeSkillCosts(gameContext)
}

export function learnSkill(gameContext: GameContext, skill: Ident): void {
   const scope = ensureScope(gameContext)
   const skillId = mSkillId(scope, skill)
   if (!gameContext.state.computedSkills!.available[skillId]) {
      throw new Error(`[E] [learnSkill] 技能 '${skillId}' 当前不可用`)
   }

   console.info(`[I] [learnSkill] 学习了技能 '${skillId}'`)

   if (gameContext.state.player.skills[skillId]) {
      console.warn(`[W] [learnSkill] 技能 '${skillId}' 已经学习，重新学习将会重新执行其事件脚本`)
   }

   const { skill: skillContent, cost } = gameContext.state.computedSkills!.available[skillId]
   delete gameContext.state.computedSkills!.available[skillId]

   gameContext.state.player.skills[skillId] = skillContent
   gameContext.updateProperty('skillPoints', 'sub', cost, '@learn_skill')

   executeSkillEffects(gameContext, skillContent)
}

export function grantSkill(gameContext: GameContext, skill: Ident, force?: boolean): void {
   const scope = ensureScope(gameContext)
   const skillId = mSkillId(scope, skill)
   let skillContent
   if (force) {
      skillContent = gameContext.ruleSet.skills[skillId]
      if (!skillContent) {
         throw new Error(`[E] [grantSkill] 技能 '${skillId}' 不存在`)
      }
   } else {
      const availableSkill = gameContext.state.computedSkills!.available[skillId]
      if (!availableSkill) {
         throw new Error(`[E] [grantSkill] 技能 '${skillId}' 当前不可用`)
      }
      skillContent = availableSkill.skill
   }

   console.info(`[I] [grantSkill] 已取得技能 '${skillId}'`)

   if (gameContext.state.player.skills[skillId]) {
      console.warn(`[W] [learnSkill] 技能 '${skillId}' 已经取得，重新取得将会重新执行其事件脚本`)
   }

   gameContext.state.player.skills[skillId] = skillContent

   executeSkillEffects(gameContext, skillContent)
}

export default {
   learnSkill,
   grantSkill
}
