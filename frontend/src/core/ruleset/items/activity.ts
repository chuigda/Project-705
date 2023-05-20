import { ItemBase } from '@app/core/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/core/ruleset/items/event'
import { PropertyId } from '@app/core/game_context/player'
import { ActivityCategoryId } from '@app/core/ruleset'

/// 活动
///
/// 对应于原版游戏中学习完一项技能之后能获得的“学习”或“娱乐”安排选项。
export interface Activity extends ItemBase {
   /// 活动类别
   readonly category: ActivityCategoryId

   /// 技能等级，和活动类别 `category` 配合，用于自动选择同一类活动里最高等级的活动
   readonly level: number

   /// 能量消耗
   readonly energyCost: number

   /// 技能产出
   readonly output?: Record<PropertyId, number>

   /// 进行活动时触发事件
   readonly events?: MaybeInlineEvent[]
}
