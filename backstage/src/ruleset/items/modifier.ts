import { ItemBase } from '@app/ruleset/items/item_base'
import { SkillCategoryId } from '@app/ruleset'
import { PropertyId } from '@app/executor/game_context/player'

/// 属性值来源
export type ValueSource =
   '@init'
   | '@turn_incr'
   | '@learn_skill'
   | '@activity'
   | '@turn'
   | '@incident'
   | '@exam'
   | '@essay_competition'
   | '@election'
   | '@variety_show'
   | '@explore'
   | '@purchase'
   | string

/// 静态修正值
export interface ModifierValue {
   /// 获得正值时的修正
   gain?: number

   /// 获得负值时的修正
   loss?: number
}

/// 一个属性的修正
export type PropertyModifier = Record<'all' | ValueSource, ModifierValue>

/// 玩家所有属性的修正
export type PlayerPropertyModifier = Record<PropertyId, PropertyModifier>

/// 技能点数消耗修正
export type SkillPointCostModifier = Record<'all' | SkillCategoryId, number>

/// 静态修正
///
/// 类似于 Stellaris 中的“修正”项目，也就是 buff。当玩家的属性值增加或者减少时，
/// 静态修正会以百分比的形式改变增加/减少的具体数值。
export interface Modifier extends ItemBase {
   /// 静态修正的图标
   icon?: string // TODO(chuigda): gfx features

   /// 属性修正
   playerProperty?: PlayerPropertyModifier

   /// 技能点数消耗修正
   skillPointCost?: SkillPointCostModifier
}
