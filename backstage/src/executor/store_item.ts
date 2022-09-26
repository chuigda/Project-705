import {
   GameContext,
   PlayerActiveRelicItem,
   PlayerConsumableItem,
   PlayerRechargeableItem,
   PlayerTradableItem
} from '@app/executor/game_context'
import { Ident, mStoreItemId } from '@app/base/uid'
import { RuleSetStoreItems, StoreItemKind } from '@app/ruleset'
import { triggerEvent } from '@app/executor/events'

const kindToFieldMapping: Record<StoreItemKind, keyof RuleSetStoreItems> = {
   'consumable': 'consumableItems',
   'rechargeable': 'rechargeableItems',
   'active_relic': 'activeRelicItems',
   'passive_relic': 'passiveRelicItems',
   'tradable': 'tradableItems'
}

export function giveConsumableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.consumableItems[identString]
   if (!item) {
      console.error(`[E] [giveConsumableItem] item '${identString}' does not exist`)
      return
   }

   if (gameContext.state.player.items.consumableItems[identString]) {
      gameContext.state.player.items.consumableItems[identString].totalChargeLevel += count
   } else {
      gameContext.state.player.items.consumableItems[identString] = new PlayerConsumableItem(item, count)
   }
}

export function giveRechargeableItem(gameContext: GameContext, itemId: Ident, chargeLevel?: number) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.rechargeableItems[identString]
   if (!item) {
      console.error(`[E] [giveRechargeableItem] item '${identString}' does not exist`)
      return
   }

   chargeLevel = chargeLevel || item.initCharge || item.maxCharge!
   if (gameContext.state.player.items.rechargeableItems[identString]) {
      console.warn(`[W] [giveRechargeableItem] player already has '${identString}', supplying charge level instead`)
      const currentChargeLevel = gameContext.state.player.items.rechargeableItems[identString].chargeLevel
      gameContext.state.player.items.rechargeableItems[identString].chargeLevel =
         Math.min(currentChargeLevel + chargeLevel, item.maxCharge!)
   } else {
      gameContext.state.player.items.rechargeableItems[identString] = new PlayerRechargeableItem(item, chargeLevel)
   }
}

export function giveActiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.activeRelicItems[identString]
   if (!item) {
      console.error(`[E] [giveActiveRelicItem] item '${identString}' does not exist`)
      return
   }

   if (gameContext.state.player.items.activeRelicItems[identString]) {
      console.warn(`[W] [giveActiveRelicItem] player already has '${identString}', resetting its cooldown`)
      gameContext.state.player.items.activeRelicItems[identString].cooldown = 0
   } else {
      gameContext.state.player.items.activeRelicItems[identString] = new PlayerActiveRelicItem(item)
   }
}

export function givePassiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.passiveRelicItems[identString]
   if (!item) {
      console.error(`[E] [givePassiveRelicItem] item '${identString}' does not exist`)
      return
   }

   if (gameContext.state.player.items.passiveRelicItems[identString]) {
      console.warn(`[W] [givePassiveRelicItem] player already has '${identString}', re-triggering its events`)
   } else {
      gameContext.state.player.items.passiveRelicItems[identString] = item
   }

   if (item.onAddedEvents) {
      for (const event of item.onAddedEvents) {
         triggerEvent(gameContext, event)
      }
   }
}

export function giveTradableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(gameContext.scope!, itemId)
   const item = gameContext.ruleSet.storeItems.tradableItems[identString]
   if (!item) {
      console.error(`[E] [giveTradableItem] item '${identString}' does not exist`)
      return
   }

   if (gameContext.state.player.items.tradableItems[identString]) {
      gameContext.state.player.items.tradableItems[identString].count += count
   } else {
      gameContext.state.player.items.tradableItems[identString] = new PlayerTradableItem(item, count)
   }
}

export function useConsumableItem(gameContext: GameContext, itemId: Ident) {}

export function useRechargeableItem(gameContext: GameContext, itemId: Ident) {}

export function useActiveRelicItem(gameContext: GameContext, itemId: Ident) {}

export function rechargeItem(gameContext: GameContext, itemId: Ident, chargeLevel?: number) {}

export function addItemToShop(gameContext: GameContext, itemId: Ident, kind: StoreItemKind, count?: number) {
   function addItemToShopImpl(k: keyof RuleSetStoreItems) {
      const identString = mStoreItemId(gameContext.scope!, itemId)
      if (!gameContext.ruleSet.storeItems[k][identString]) {
         console.error(`[E] [addItemToShop] shop item '${identString}' of kind '${kind}' does not exist`)
         return
      }

      if (gameContext.state.shop[k][identString]) {
         gameContext.state.shop[k][identString] += (count || 1)
      } else {
         gameContext.state.shop[k][identString] = (count || 1)
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

      delete gameContext.state.shop[k][identString]
   }

   removeItemFromShopImpl(kindToFieldMapping[kind])
}

export function purchaseConsumableItem(gameContext: GameContext, itemId: Ident, count?: number) {}

export function purchaseRechargeableItem(gameContext: GameContext, itemId: Ident, count?: number) {}

export function purchaseActiveRelicItem(gameContext: GameContext, itemId: Ident) {}

export function purchasePassiveRelicItem(gameContext: GameContext, itemId: Ident) {}

export function purchaseTradableItem(gameContext: GameContext, itemId: Ident) {}

export function sellTradableItem(gameContext: GameContext, itemId: Ident) {}
