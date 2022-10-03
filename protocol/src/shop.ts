import {
   IActiveRelicItem,
   IConsumableItem, IPassiveRelicItem,
   IRechargeableItem,
   IStoreItemBase,
   IStoreItemKind,
   ITradableItem
} from './store_item'

export interface IShopItem<Item extends IStoreItemBase<any>> {
   item: Item
   count: number
}

export interface IShopStatus {
   shopEnabled: boolean

   consumableItems: IShopItem<IConsumableItem>[]
   tradableItems: IShopItem<ITradableItem>[]
   rechargeableItems: IRechargeableItem[]
   activeRelicItems: IActiveRelicItem[]
   passiveRelicItems: IPassiveRelicItem[]
}
