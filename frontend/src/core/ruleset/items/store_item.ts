import { ItemBase } from '@app/core/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/core/ruleset'

export type StoreItemLevel =
   'normal'
   | 'rare'
   | 'epic'
   | 'legend'
   | 'myth'

export type StoreItemKind =
   'consumable'
   | 'rechargeable'
   | 'active_relic'
   | 'passive_relic'
   | 'tradable'

/// 商店物品
export interface StoreItem<ItemKindString extends StoreItemKind> extends ItemBase {
   /// 物品类别
   kind: ItemKindString

   /// 物品等级
   level?: StoreItemLevel

   /// 商店售价
   price?: number

   /// 激活物品所消耗的能量
   // TODO 这个设计可能是有问题的
   energyCost?: number
}

/// 消耗品
export interface ConsumableItem extends StoreItem<'consumable'> {
   /// 从商店购买一份所获得的充能层数，默认为 1
   initCharge?: number

   /// 使用消耗品时触发的事件
   consumeEvents?: MaybeInlineEvent[]
}

/// 可充物品
export interface RechargeableItem extends StoreItem<'rechargeable'> {
   /// 初始充能层数
   initCharge?: number

   /// 最大充能层数
   maxCharge?: number

   /// 从商店购买/被添加到物品库时触发的事件
   onAddedEvents?: MaybeInlineEvent[]

   /// 使用物品时触发的事件
   consumeEvents?: MaybeInlineEvent[]
}

/// 带有主动技能的物品
export interface ActiveRelicItem extends StoreItem<'active_relic'> {
   /// 冷却时间
   cooldown: number

   /// 激活主动技能时触发的事件
   activateEvents?: MaybeInlineEvent[]
}

/// 被动型物品
export interface PassiveRelicItem extends StoreItem<'passive_relic'> {
   /// 从商店购买/被添加到物品库时触发的事件
   onAddedEvents?: MaybeInlineEvent[]
}

/// 可交易物品
export interface TradableItem extends StoreItem<'tradable'> {
   /// 出售价值
   sellValue: number
}
