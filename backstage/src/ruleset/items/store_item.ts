import { ItemBase } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset'
import { GameContext } from '@app/executor/game_context'

export type StoreItemKind =
   'consumable'
   | 'rechargeable'
   | 'active_relic'
   | 'passive_relic'
   | 'tradable'

export type StoreItemLevel =
   'normal'
   | 'rare'
   | 'epic'
   | 'legend'
   | 'myth'

export interface StoreItem<ItemKindString extends StoreItemKind> extends ItemBase {
   kind: ItemKindString
   level?: StoreItemLevel
   price?: number
   energyCost?: number
}

export interface ConsumableItem extends StoreItem<'consumable'> {
   initCharge?: number
   consumeEvents?: MaybeInlineEvent[]
}

export interface RechargeableItem extends StoreItem<'rechargeable'> {
   initCharge?: number
   maxCharge?: number
   onAddedEvents?: MaybeInlineEvent[]
   consumeEvents?: MaybeInlineEvent[]
}

export interface ActiveRelicItem extends StoreItem<'active_relic'> {
   cooldown: number
   activateEvents?: MaybeInlineEvent[]
}

export interface PassiveRelicItem extends StoreItem<'passive_relic'> {
   onAddedEvents?: MaybeInlineEvent[]
}

export interface TradableItem extends StoreItem<'tradable'> {
   sellValue: number | ((gameContext: GameContext) => number)
}
