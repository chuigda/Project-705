import {
   GameContext, GameContextEvents,
   PlayerActiveRelicItem,
   PlayerConsumableItem,
   PlayerRechargeableItem, PlayerStatus,
   PlayerTradableItem
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

const kindToFieldMapping: Record<StoreItemKind, keyof RuleSetStoreItems> = {
   'consumable': 'consumableItems',
   'rechargeable': 'rechargeableItems',
   'active_relic': 'activeRelicItems',
   'passive_relic': 'passiveRelicItems',
   'tradable': 'tradableItems'
}

function addConsumableItemImpl(gameContext: GameContext, item: ConsumableItem, identString: string, count: number) {
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
   if (gameContext.state.player.items.activeRelicItems[identString]) {
      console.warn(`[W] [addActiveRelicItemImpl] player already has '${identString}', resetting its cooldown`)
      gameContext.state.player.items.activeRelicItems[identString].cooldown = 0
   } else {
      gameContext.state.player.items.activeRelicItems[identString] = new PlayerActiveRelicItem(item)
   }
}

function addPassiveRelicItemImpl(gameContext: GameContext, item: PassiveRelicItem, identString: string) {
   if (gameContext.state.player.items.passiveRelicItems[identString]) {
      console.warn(`[W] [addPassiveRelicItemImpl] player already has '${identString}', re-triggering its events`)
   } else {
      gameContext.state.player.items.passiveRelicItems[identString] = item
   }

   triggerEventSeries(gameContext, item.onAddedEvents, item.scope)
}

function addTradableItemImpl(gameContext: GameContext, item: TradableItem, identString: string, count: number) {
   if (gameContext.state.player.items.tradableItems[identString]) {
      gameContext.state.player.items.tradableItems[identString].count += count
   } else {
      gameContext.state.player.items.tradableItems[identString] = new PlayerTradableItem(item, count)
   }
}

export function giveConsumableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.consumableItems[identString]
   if (!item) {
      console.error(`[E] [giveConsumableItem] item '${identString}' does not exist`)
      return
   }

   addConsumableItemImpl(gameContext, item, identString, count)
}

export function giveRechargeableItem(gameContext: GameContext, itemId: Ident, chargeLevel?: number) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.rechargeableItems[identString]
   if (!item) {
      console.error(`[E] [giveRechargeableItem] item '${identString}' does not exist`)
      return
   }

   chargeLevel = chargeLevel || item.initCharge || item.maxCharge!
   addRechargeableItemImpl(gameContext, item, identString, chargeLevel)
}

export function giveActiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.activeRelicItems[identString]
   if (!item) {
      console.error(`[E] [giveActiveRelicItem] item '${identString}' does not exist`)
      return
   }

   addActiveRelicItemImpl(gameContext, item, identString)
}

export function givePassiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.passiveRelicItems[identString]
   if (!item) {
      console.error(`[E] [givePassiveRelicItem] item '${identString}' does not exist`)
      return
   }

   addPassiveRelicItemImpl(gameContext, item, identString)
}

export function giveTradableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.tradableItems[identString]
   if (!item) {
      console.error(`[E] [giveTradableItem] item '${identString}' does not exist`)
      return
   }

   addTradableItemImpl(gameContext, item, identString, count)
}

export function useConsumableItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   const playerItem = gameContext.state.player.items.consumableItems[identString]
   if (!playerItem) {
      console.error(`[E] [useConsumableItem] item '${identString}' does not exist`)
      return
   }

   triggerEventSeries(gameContext, playerItem.item.consumeEvents, playerItem.item.scope)
   playerItem.totalChargeLevel -= 1
   if (playerItem.totalChargeLevel === 0) {
      delete gameContext.state.player.items.consumableItems[identString]
   }
}

export function useRechargeableItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   const playerItem = gameContext.state.player.items.rechargeableItems[identString]
   if (!playerItem) {
      console.error(`[E] [useRechargeableItem] item '${identString}' does not exist`)
      return
   }

   if (playerItem.chargeLevel === 0) {
      console.error(`[E] [useRechargeableItem] item '${identString}' is not charged`)
      return
   }

   triggerEventSeries(gameContext, playerItem.item.consumeEvents)
   playerItem.chargeLevel -= 1
}

export function useActiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   const playerItem = gameContext.state.player.items.activeRelicItems[identString]
   if (!playerItem) {
      console.error(`[E] [useActiveRelicItem] item '${identString} does not exist'`)
      return
   }

   if (playerItem.cooldown !== 0) {
      console.error(`[E] [useActiveRelicItem] item '${identString}' is not ready yet`)
      return
   }

   triggerEventSeries(gameContext, playerItem.item.activateEvents)
   playerItem.cooldown = playerItem.item.cooldown
}

export function rechargeItem(gameContext: GameContext, itemId: Ident, chargeLevel?: number) {
   chargeLevel = chargeLevel || 1

   const identString = mStoreItemId(gameContext.scope!, itemId)
   const playerItem = gameContext.state.player.items.rechargeableItems[identString]
   if (!playerItem) {
      console.error(`[E] [useRechargeableItem] item '${identString}' does not exist`)
      return
   }

   playerItem.chargeLevel += chargeLevel
   if (playerItem.item.maxCharge && playerItem.chargeLevel > playerItem.item.maxCharge) {
      playerItem.chargeLevel = playerItem.item.maxCharge
   }
}

export function addItemToShop(gameContext: GameContext, itemId: Ident, kind: StoreItemKind, count?: number) {
   function addItemToShopImpl(k: keyof RuleSetStoreItems) {
      const identString = mStoreItemId(gameContext.scope!, itemId)
      if (!gameContext.ruleSet.storeItems[k][identString]) {
         console.error(`[E] [addItemToShop] shop item '${identString}' of kind '${kind}' does not exist`)
         return
      }

      if (gameContext.state.shop[k] instanceof Set) {
         const shop = <Set<string>>gameContext.state.shop[k]
         shop.add(identString)
      } else {
         const shop = <Record<string, number>>gameContext.state.shop[k]
         if (shop[identString]) {
            shop[identString] += (count || 1)
         } else {
            shop[identString] = (count || 1)
         }
      }
   }

   addItemToShopImpl(kindToFieldMapping[kind])
}

export function removeItemFromShop(gameContext: GameContext, itemId: Ident, kind: StoreItemKind) {
   function removeItemFromShopImpl(k: keyof RuleSetStoreItems) {
      const identString = mStoreItemId(gameContext.scope!, itemId)
      if (!gameContext.ruleSet.storeItems[k][identString]) {
         console.error(`[E] [removeItemFromShop] shop item '${identString}' of kind '${kind}' does not exist`)
         return
      }

      if (gameContext.state.shop[k] instanceof Set) {
         const shop = <Set<string>>gameContext.state.shop[k]
         shop.delete(identString)
      } else {
         const shop = <Record<string, number>>gameContext.state.shop[k]
         delete shop[identString]
      }
   }

   removeItemFromShopImpl(kindToFieldMapping[kind])
}

function checkPrice<IKS extends StoreItemKind>(player: PlayerStatus, item: StoreItem<IKS>, count?: number) {
   const totalPrice = (item.price || 0) * (count || 1)
   if (totalPrice > player.money) {
      console.error('[E] [checkPrice] not enough money')
      return false
   }

   player.money -= totalPrice
   return true
}

export function purchaseConsumableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(gameContext.scope!, itemId)
   const shopItemCount = gameContext.state.shop.consumableItems[identString]
   if (!shopItemCount) {
      console.error(`[E] [purchaseConsumableItem] item '${identString}' does not exist`)
      return
   }

   if (count > shopItemCount) {
      console.error(`[E] [purchaseConsumableItem] not enough '${identString}': expected ${count}, got ${shopItemCount}`)
      return
   }

   const item = gameContext.ruleSet.storeItems.consumableItems[identString]
   if (!checkPrice(gameContext.state.player, item, count)) {
      return
   }

   gameContext.state.shop.consumableItems[identString] -= count
   addConsumableItemImpl(gameContext, item, identString, count)
}

export function purchaseRechargeableItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   if (!gameContext.state.shop.rechargeableItems.has(identString)) {
      console.error(`[E] [purchaseRechargeableItem] item '${identString}' does not exist`)
      return
   }

   const item = gameContext.ruleSet.storeItems.rechargeableItems[identString]
   if (!checkPrice(gameContext.state.player, item)) {
      return
   }

   gameContext.state.shop.rechargeableItems.delete(identString)
   addRechargeableItemImpl(gameContext, item, identString, item.initCharge!)
}

export function purchaseActiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   if (!gameContext.state.shop.activeRelicItems.has(identString)) {
      console.error(`[E] [purchaseActiveRelicItem] item '${identString}' does not exist`)
      return
   }

   const item = gameContext.ruleSet.storeItems.activeRelicItems[identString]
   if (!checkPrice(gameContext.state.player, item)) {
      return
   }

   gameContext.state.shop.activeRelicItems.delete(identString)
   addActiveRelicItemImpl(gameContext, item, identString)
}

export function purchasePassiveRelicItem(gameContext: GameContext, itemId: Ident) {}

export function purchaseTradableItem(gameContext: GameContext, itemId: Ident) {}

export function sellTradableItem(gameContext: GameContext, itemId: Ident) {}
