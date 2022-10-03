import { Skill, SkillCost, SkillOutput } from '@app/ruleset'
import { ISkill, ISkillCost, ISkillOutput } from '@protocol/skill'
import { sendPartialPlayerAttributes } from '@app/server/mapping/player'
import { sendItemBase } from '@app/server/mapping/item_base'
import { ITranslationKey } from '@protocol/translation'

export function sendSkillCost(sc: SkillCost): ISkillCost {
   return {
      base: sc.base,
      attributes: sc.attributes && sendPartialPlayerAttributes(sc.attributes)
   }
}

export function sendSkillOutput(so: SkillOutput): ISkillOutput {
   return {
      attributes: sendPartialPlayerAttributes(so.attributes)
   }
}

export function sendSkill(s: Skill): ISkill {
   return {
      ...sendItemBase(s),

      category: s.category,
      cost: sendSkillCost(s.cost),
      output: s.output && sendSkillOutput(s.output),
      // 按理说应该写 s.activities.map(sendTranslationKey)，不过因为 sendTranslationKey 是 NOP 所以直接转了
      activities: s.activities && <ITranslationKey[]>s.activities
   }
}
