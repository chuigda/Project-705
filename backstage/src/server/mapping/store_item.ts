import {
   ActiveRelicItem,
   ConsumableItem,
   PassiveRelicItem,
   RechargeableItem,
   StoreItem,
   TradableItem
} from '@app/core/ruleset'
import {
   IActiveRelicItem,
   IConsumableItem, IPassiveRelicItem,
   IRechargeableItem,
   IStoreItemBase,
   IStoreItemKind, ITradableItem
} from '@protocol/store_item'
import { ITranslationKey } from '@protocol/translation'

function sendItemBase<IKS extends IStoreItemKind>(item: StoreItem<IKS>): IStoreItemBase<IKS> {
   const { ident, name, description, kind, level, price, energyCost } = item
   return {
      ident: <string>ident,
      name: <ITranslationKey>name,
      description: <ITranslationKey>description,

      kind,
      level: level!,
      price,
      energyCost
   }
}

export function sendConsumableItem(item: ConsumableItem): IConsumableItem {
   const itemBase = sendItemBase(item)
   const { initCharge } = item
   return {
      ...itemBase,
      initCharge: initCharge!
   }
}

export function sendRechargeableItem(item: RechargeableItem): IRechargeableItem {
   const itemBase = sendItemBase(item)
   const { initCharge, maxCharge } = item
   return {
      ...itemBase,
      initCharge: initCharge!,
      maxCharge: maxCharge!
   }
}

export function sendActiveRelicItem(item: ActiveRelicItem): IActiveRelicItem {
   const itemBase = sendItemBase(item)
   const { cooldown } = item
   return {
      ...itemBase,
      cooldown
   }
}

export function sendPassiveRelicItem(item: PassiveRelicItem): IPassiveRelicItem {
   return sendItemBase(item)
}

export function sendTradableItem(item: TradableItem): ITradableItem {
   const itemBase = sendItemBase(item)
   const { sellValue } = item
   return {
      ...itemBase,
      sellValue
   }
}
