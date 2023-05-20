import { ItemBase } from '@app/core/ruleset/items/item_base'
import { PotentialExpression } from '@app/core/ruleset/items/potential'
import { MaybeInlineEvent } from '@app/core/ruleset/items/event'
import { Ident } from '@app/core/base/uid'

/// 飞升天赋
///
/// 在原版游戏中没有对应的内容，相对而言类似于《群星》中的飞升项目。可以被认为是“人生中重大的决策”。
export interface AscensionPerk extends ItemBase {
   /// 飞升激活需求
   readonly potential?: PotentialExpression[]

   /// 激活飞升后提供的静态修正
   readonly modifier?: Ident

   /// 激活飞升时执行的事件列表
   readonly events?: MaybeInlineEvent[]
}
