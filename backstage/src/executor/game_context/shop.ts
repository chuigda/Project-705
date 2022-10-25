import {
   StoreItem,
   ConsumableItem,
   RechargeableItem,
   ActiveRelicItem,
   PassiveRelicItem,
   TradableItem
} from '@app/ruleset'

export class ShopItem<T extends StoreItem<any>> {
   readonly item: T
   count: number

   constructor(item: T, count?: number) {
      this.item = item
      this.count = count || 1
   }
}

export class ShopStatus {
   shopEnabled: boolean = false
   consumableItems: Record<string, ShopItem<ConsumableItem>> = {}
   tradableItems: Record<string, ShopItem<TradableItem>> = {}

   rechargeableItems: Record<string, RechargeableItem> = {}
   activeRelicItems: Record<string, ActiveRelicItem> = {}
   passiveRelicItems: Record<string, PassiveRelicItem> = {}
}
