import { ItemBase } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset'
import { GameContext } from '@app/executor/game_context'

export type StoreItemKind =
   'consumable'
   | 'rechargeable'
   | 'active_relic'
   | 'passive_relic'
   | 'tradable'

export interface StoreItem extends ItemBase {
   itemKind: StoreItemKind
   price?: number
   events?: MaybeInlineEvent[]
}

export interface ConsumableItem extends StoreItem {
   itemKind: 'consumable'
   initCharge: number
}

export interface RechargeableItem extends StoreItem {
   itemKind: 'rechargeable'
   initCharge: number
   maxCharge: number
}

export interface ActiveRelicItem extends StoreItem {
   itemKind: 'active_relic'
   cooldown: number
}

export interface PassiveRelicItem extends StoreItem {
   itemKind: 'passive_relic'
}

export interface TradableItem extends StoreItem {
   itemKind: 'tradable'
   sellValue: number | ((gameContext: GameContext) => number)
}
