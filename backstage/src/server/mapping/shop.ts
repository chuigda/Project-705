import { ShopItem, ShopStatus } from '@app/core/game_context'
import { IShopItem, IShopStatus } from '@protocol/shop'
import { IStoreItemBase, IStoreItemKind } from '@protocol/store_item'
import { StoreItem } from '@app/core/ruleset'

import {
   sendActiveRelicItem,
   sendConsumableItem,
   sendPassiveRelicItem,
   sendRechargeableItem,
   sendTradableItem
} from './store_item'

function sendShopItem<
   IKS extends IStoreItemKind,
   T extends StoreItem<IKS>,
   U extends IStoreItemBase<IKS>
>(
   shopItem: ShopItem<T>,
   f: (t: T) => U
): IShopItem<U> {
   const { item, count } = shopItem
   return {
      item: f(item),
      count
   }
}

export function sendShopStatus(shopStatus: ShopStatus): IShopStatus {
   const {
      shopEnabled,
      consumableItems,
      tradableItems,
      rechargeableItems,
      activeRelicItems,
      passiveRelicItems
   } = shopStatus

   return {
      shopEnabled,
      consumableItems: Object.values(consumableItems).map(item => sendShopItem(item, sendConsumableItem)),
      tradableItems: Object.values(tradableItems).map(item => sendShopItem(item, sendTradableItem)),
      rechargeableItems: Object.values(rechargeableItems).map(sendRechargeableItem),
      activeRelicItems: Object.values(activeRelicItems).map(sendActiveRelicItem),
      passiveRelicItems: Object.values(passiveRelicItems).map(sendPassiveRelicItem)
   }
}
