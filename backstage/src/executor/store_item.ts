import {
   GameContext,
   PlayerActiveRelicItem,
   PlayerConsumableItem,
   PlayerRechargeableItem,
   PlayerTradableItem,
   ShopItem
} from '@app/executor/game_context'
import { Ident, mStoreItemId } from '@app/base/uid'
import {
   ActiveRelicItem,
   ConsumableItem,
   PassiveRelicItem,
   RechargeableItem,
   RuleSetStoreItems, StoreItem,
   StoreItemKind, TradableItem
} from '@app/ruleset'
import { triggerEventSeries } from '@app/executor/events'
import { getPropertyValue, updateProperty } from '@app/executor/property'
import { ensureScope } from '@app/executor/game_context/scope'

const kindToFieldMapping: Record<StoreItemKind, keyof RuleSetStoreItems> = {
   'consumable': 'consumableItems',
   'rechargeable': 'rechargeableItems',
   'active_relic': 'activeRelicItems',
   'passive_relic': 'passiveRelicItems',
   'tradable': 'tradableItems'
}

function addConsumableItemImpl(gameContext: GameContext, item: ConsumableItem, identString: string, count: number) {
   gameContext.updateTracker.player.items = true
   if (gameContext.state.player.items.consumableItems[identString]) {
      gameContext.state.player.items.consumableItems[identString].totalChargeLevel += count
   } else {
      gameContext.state.player.items.consumableItems[identString] = new PlayerConsumableItem(item, count)
   }
}

function addRechargeableItemImpl(
   gameContext: GameContext,
   item: RechargeableItem,
   identString: string,
   chargeLevel: number
) {
   gameContext.updateTracker.player.items = true
   if (gameContext.state.player.items.rechargeableItems[identString]) {
      console.warn(`[W] [addRechargeableItemImpl] player already has '${identString}', supplying charge level instead`)
      const currentChargeLevel = gameContext.state.player.items.rechargeableItems[identString].chargeLevel
      gameContext.state.player.items.rechargeableItems[identString].chargeLevel =
         Math.min(currentChargeLevel + chargeLevel, item.maxCharge!)
   } else {
      gameContext.state.player.items.rechargeableItems[identString] = new PlayerRechargeableItem(item, chargeLevel)
   }
   triggerEventSeries(gameContext, item.onAddedEvents, item.scope)
}

function addActiveRelicItemImpl(gameContext: GameContext, item: ActiveRelicItem, identString: string) {
   gameContext.updateTracker.player.items = true
   if (gameContext.state.player.items.activeRelicItems[identString]) {
      console.warn(`[W] [addActiveRelicItemImpl] player already has '${identString}', resetting its cooldown`)
      gameContext.state.player.items.activeRelicItems[identString].cooldown = 0
   } else {
      gameContext.state.player.items.activeRelicItems[identString] = new PlayerActiveRelicItem(item)
   }
}

function addPassiveRelicItemImpl(gameContext: GameContext, item: PassiveRelicItem, identString: string) {
   gameContext.updateTracker.player.items = true
   if (gameContext.state.player.items.passiveRelicItems[identString]) {
      console.warn(`[W] [addPassiveRelicItemImpl] player already has '${identString}', re-triggering its events`)
   } else {
      gameContext.state.player.items.passiveRelicItems[identString] = item
   }

   triggerEventSeries(gameContext, item.onAddedEvents, item.scope)
}

function addTradableItemImpl(gameContext: GameContext, item: TradableItem, identString: string, count: number) {
   gameContext.updateTracker.player.items = true
   if (gameContext.state.player.items.tradableItems[identString]) {
      gameContext.state.player.items.tradableItems[identString].count += count
   } else {
      gameContext.state.player.items.tradableItems[identString] = new PlayerTradableItem(item, count)
   }
}

export function giveConsumableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.consumableItems[identString]
   if (!item) {
      console.error(`[E] [giveConsumableItem] item '${identString}' does not exist`)
      return
   }

   addConsumableItemImpl(gameContext, item, identString, count)
}

export function giveRechargeableItem(gameContext: GameContext, itemId: Ident, chargeLevel?: number) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.rechargeableItems[identString]
   if (!item) {
      console.error(`[E] [giveRechargeableItem] item '${identString}' does not exist`)
      return
   }

   chargeLevel = chargeLevel || item.initCharge || item.maxCharge!
   addRechargeableItemImpl(gameContext, item, identString, chargeLevel)
}

export function giveActiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.activeRelicItems[identString]
   if (!item) {
      console.error(`[E] [giveActiveRelicItem] item '${identString}' does not exist`)
      return
   }

   addActiveRelicItemImpl(gameContext, item, identString)
}

export function givePassiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.passiveRelicItems[identString]
   if (!item) {
      console.error(`[E] [givePassiveRelicItem] item '${identString}' does not exist`)
      return
   }

   addPassiveRelicItemImpl(gameContext, item, identString)
}

export function giveTradableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.tradableItems[identString]
   if (!item) {
      console.error(`[E] [giveTradableItem] item '${identString}' does not exist`)
      return
   }

   addTradableItemImpl(gameContext, item, identString, count)
}

export function useConsumableItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const playerItem = gameContext.state.player.items.consumableItems[identString]
   if (!playerItem) {
      console.error(`[E] [useConsumableItem] item '${identString}' does not exist`)
      return
   }

   gameContext.updateTracker.player.items = true
   triggerEventSeries(gameContext, playerItem.item.consumeEvents, playerItem.item.scope)
   playerItem.totalChargeLevel -= 1
   if (playerItem.totalChargeLevel === 0) {
      delete gameContext.state.player.items.consumableItems[identString]
   }
}

export function useRechargeableItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const playerItem = gameContext.state.player.items.rechargeableItems[identString]
   if (!playerItem) {
      console.error(`[E] [useRechargeableItem] item '${identString}' does not exist`)
      return
   }

   if (playerItem.chargeLevel === 0) {
      console.error(`[E] [useRechargeableItem] item '${identString}' is not charged`)
      return
   }

   gameContext.updateTracker.player.items = true
   triggerEventSeries(gameContext, playerItem.item.consumeEvents)
   playerItem.chargeLevel -= 1
}

export function useActiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const playerItem = gameContext.state.player.items.activeRelicItems[identString]
   if (!playerItem) {
      console.error(`[E] [useActiveRelicItem] item '${identString} does not exist'`)
      return
   }

   if (playerItem.cooldown !== 0) {
      console.error(`[E] [useActiveRelicItem] item '${identString}' is not ready yet`)
      return
   }

   gameContext.updateTracker.player.items = true
   triggerEventSeries(gameContext, playerItem.item.activateEvents)
   playerItem.cooldown = playerItem.item.cooldown
}

export function rechargeItem(gameContext: GameContext, itemId: Ident, chargeLevel?: number) {
   chargeLevel = chargeLevel || 1

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const playerItem = gameContext.state.player.items.rechargeableItems[identString]
   if (!playerItem) {
      console.error(`[E] [useRechargeableItem] item '${identString}' does not exist`)
      return
   }

   gameContext.updateTracker.player.items = true
   playerItem.chargeLevel += chargeLevel
   if (playerItem.item.maxCharge && playerItem.chargeLevel > playerItem.item.maxCharge) {
      playerItem.chargeLevel = playerItem.item.maxCharge
   }
}

export function addItemToShop(gameContext: GameContext, itemId: Ident, kind: StoreItemKind, count?: number) {
   const k = kindToFieldMapping[kind]

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems[k][identString]
   if (!item) {
      console.error(`[E] [addItemToShop] shop item '${identString}' of kind '${kind}' does not exist`)
      return
   }

   gameContext.updateTracker.shop = true
   switch (kind) {
      case 'consumable':
      case 'tradable': {
         const shop = <Record<string, ShopItem<StoreItem<any>>>>gameContext.state.shop[k]
         if (!shop[identString]) {
            shop[identString] = new ShopItem(item, count)
         } else {
            shop[identString].count += (count || 1)
         }
         break
      }
      case 'rechargeable':
      case 'active_relic':
      case 'passive_relic': {
         if (count && count !== 1) {
            console.warn('[W] [addItemToShop] relic items and rechargeable items are considered unique')
         }
         const shop = <Record<string, StoreItem<any>>>gameContext.state.shop[k]
         if (shop[identString]) {
            console.warn(`[W] [addItemToShop] item '${identString}' already exists in shop`)
         }
         shop[identString] = item
         break
      }
   }
}

export function removeItemFromShop(gameContext: GameContext, itemId: Ident, kind: StoreItemKind) {
   const k = kindToFieldMapping[kind]

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   if (!gameContext.ruleSet.storeItems[k][identString]) {
      console.error(`[E] [removeItemFromShop] shop item '${identString}' of kind '${kind}' does not exist`)
      return
   }

   gameContext.updateTracker.shop = true
   const shop = <Record<string, any>>gameContext.state.shop[k]
   delete shop[identString]
}

function checkPrice<IKS extends StoreItemKind>(gameContext: GameContext, item: StoreItem<IKS>, count?: number) {
   const totalPrice = (item.price || 0) * (count || 1)
   if (totalPrice > getPropertyValue(gameContext, '@money')!) {
      console.error('[E] [checkPrice] not enough money')
      return false
   }

   updateProperty(gameContext, '@money', 'sub', totalPrice, '@purchase')
   return true
}

export function purchaseConsumableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const shopItemCount = gameContext.state.shop.consumableItems[identString].count
   if (!shopItemCount) {
      console.error(`[E] [purchaseConsumableItem] item '${identString}' does not exist`)
      return
   }

   if (count > shopItemCount) {
      console.error(`[E] [purchaseConsumableItem] not enough '${identString}': expected ${count}, got ${shopItemCount}`)
      return
   }

   const item = gameContext.ruleSet.storeItems.consumableItems[identString]
   if (!checkPrice(gameContext, item, count)) {
      return
   }

   gameContext.state.shop.consumableItems[identString].count -= count
   addConsumableItemImpl(gameContext, item, identString, count)
}

export function purchaseRechargeableItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.state.shop.rechargeableItems[identString]
   if (!item) {
      console.error(`[E] [purchaseRechargeableItem] item '${identString}' does not exist`)
      return
   }

   if (!checkPrice(gameContext, item)) {
      return
   }

   delete gameContext.state.shop.rechargeableItems[identString]
   addRechargeableItemImpl(gameContext, item, identString, item.initCharge!)
}

export function purchaseActiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.state.shop.activeRelicItems[identString]

   if (!item) {
      console.error(`[E] [purchaseActiveRelicItem] item '${identString}' does not exist`)
      return
   }

   if (!checkPrice(gameContext, item)) {
      return
   }

   addActiveRelicItemImpl(gameContext, item, identString)
   delete gameContext.state.shop.activeRelicItems[identString]
}

export function purchasePassiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.state.shop.passiveRelicItems[identString]
   if (!item) {
      console.error(`[E] [purchasePassiveRelicItem] item '${identString}' does not exist`)
      return
   }

   if (!checkPrice(gameContext, item)) {
      return
   }

   addPassiveRelicItemImpl(gameContext, item, identString)
   delete gameContext.state.shop.passiveRelicItems[identString]
}

export function purchaseTradableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const shopItemCount = gameContext.state.shop.tradableItems[identString].count
   if (!shopItemCount) {
      console.error(`[E] [purchaseTradableItem] item '${identString}' does not exist`)
      return
   }

   if (shopItemCount < count) {
      console.error(`[E] [purchaseTradableItem] not enough '${identString}': expected ${count}, got ${shopItemCount}`)
      return
   }

   const item = gameContext.ruleSet.storeItems.tradableItems[identString]
   if (!checkPrice(gameContext, item, count)) {
      return
   }

   gameContext.state.shop.tradableItems[identString].count -= count
   addTradableItemImpl(gameContext, item, identString, count)
}

export function sellTradableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const playerItem = gameContext.state.player.items.tradableItems[identString]
   if (!playerItem) {
      console.error(`[E] [sellTradableItem] item '${identString}' does not exist`)
      return
   }

   if (playerItem.count < count) {
      console.error(`[E] [sellTradableItem] not enough '${identString}': expected ${count}, got ${playerItem.count}`)
      return
   }

   gameContext.updateTracker.player.items = true
   playerItem.count -= count
   const sellValue = playerItem.item.sellValue * count
   updateProperty(gameContext, 'money', 'add', Math.ceil(sellValue))
   if (playerItem.count === 0) {
      delete gameContext.state.player.items.tradableItems[identString]
   }
}

const storeItemFunctions = {
   giveConsumableItem,
   giveRechargeableItem,
   giveActiveRelicItem,
   givePassiveRelicItem,
   giveTradableItem,
   rechargeItem,
   addItemToShop,
   removeItemFromShop
}

export default storeItemFunctions
