import { Skill, SkillCost } from '@app/ruleset'
import { ISkill, ISkillCost } from '@protocol/skill'
import { sendItemBase } from '@app/server/mapping/item_base'
import { ITranslationKey } from '@protocol/translation'

export function sendSkillCost(sc: SkillCost): ISkillCost {
   return {
      base: sc.base,
      properties: sc.properties
   }
}

export function sendSkill(s: Skill): ISkill {
   return {
      ...sendItemBase(s),

      category: s.category,
      cost: sendSkillCost(s.cost),
      output: s.output,
      // 按理说应该写 s.activities.map(sendTranslationKey)，不过因为 sendTranslationKey 是 NOP 所以直接转了
      activities: s.activities && <ITranslationKey[]>s.activities
   }
}
