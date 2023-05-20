import { ItemBase } from '@app/core/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/core/ruleset/items/event'

/// 起源
///
/// 类似于原版游戏中进行传承时的“上一代”属性，但 Project-705 的起源更像是 Stellaris 的起源选项，
/// 可以在游戏开始时自由选择，并且能产生更多类型的影响。
export interface Startup extends ItemBase {
   /// 选择起源后，在游戏开始时运行的事件
   readonly events?: MaybeInlineEvent[]
}
