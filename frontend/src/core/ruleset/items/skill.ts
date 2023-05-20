import { PotentialExpression } from '@app/core/ruleset/items/potential'
import { Ident } from '@app/core/base/uid'
import { ItemBase } from '@app/core/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/core/ruleset/items/event'
import { SkillCategoryId } from '@app/core/ruleset'
import { PropertyId } from '@app/core/game_context/player'

/// 技能需求表达式
///
/// 在描述技能的前置需求时，除了常规的组合逻辑算子和函数算子，还可以直接填写另一个技能的唯一标识符
export type SkillPotential = PotentialExpression | Ident

export interface SkillCost {
   base: number
   properties?: Record<PropertyId, number>
}

/// 技能
///
/// 对应于原版游戏中可学习的技能
export interface Skill extends ItemBase {
   /// 技能类别
   readonly category?: SkillCategoryId

   /// 需求表达式
   readonly potential?: SkillPotential[]

   /// 技能消耗
   readonly cost: SkillCost

   /// 技能产出
   readonly output?: Record<PropertyId, number>

   /// 学习技能后提供的活动 (`Activity`)
   readonly activities?: Ident[]

   /// 学习技能时触发的事件
   readonly events?: MaybeInlineEvent[]
}
