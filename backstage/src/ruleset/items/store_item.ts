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
   events: MaybeInlineEvent[]
}

export interface ConsumableItem extends StoreItem {
   itemKind: 'consumable'
   initCharge: number
}

export interface RechargableItem extends StoreItem {
   itemKind: 'rechargeable'
   initCharge: number
   maxCharge: number
}

export interface ActiveRelicItem extends StoreItem {
   itemKind: 'active_relic'
   cooldown: number
   unique: boolean
}

export interface PassiveRelicItem extends StoreItem {
   itemKind: 'passive_relic'
   unique: boolean
}

export interface Tradable extends StoreItem {
   itemKind: 'tradable'
   sellValue: number | ((gameContext: GameContext) => number)
}
