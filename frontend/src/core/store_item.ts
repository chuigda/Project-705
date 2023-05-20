import {
   GameContext,
   PlayerActiveRelicItem,
   PlayerConsumableItem,
   PlayerRechargeableItem,
   PlayerTradableItem,
   ShopItem
} from '@app/core/game_context'
import { Ident, mStoreItemId } from '@app/core/base/uid'
import {
   ActiveRelicItem,
   ConsumableItem,
   PassiveRelicItem,
   RechargeableItem,
   RuleSetStoreItems, StoreItem,
   StoreItemKind, TradableItem
} from '@app/core/ruleset'
import { triggerEventSeries } from '@app/core/events'
import { getPropertyValue, updateProperty } from '@app/core/property'
import { ensureScope } from '@app/core/game_context/scope'

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
      console.warn(`[W] [addRechargeableItemImpl] 玩家已拥有可充能物品 '${identString}', 重新给予道具将提供充能层数`)
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
      console.warn(`[W] [addActiveRelicItemImpl] 玩家已拥有具有主动技能的物品 '${identString}', 重新给予道具将重置其冷却时间`)
      gameContext.state.player.items.activeRelicItems[identString].cooldown = 0
   } else {
      gameContext.state.player.items.activeRelicItems[identString] = new PlayerActiveRelicItem(item)
   }
}

function addPassiveRelicItemImpl(gameContext: GameContext, item: PassiveRelicItem, identString: string) {
   if (gameContext.state.player.items.passiveRelicItems[identString]) {
      console.warn(`[W] [addPassiveRelicItemImpl] 玩家已拥有被动性物品 '${identString}', 重新给予道具将重新执行其事件脚本`)
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

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.consumableItems[identString]
   if (!item) {
      console.error(`[E] [giveConsumableItem] 消耗品 '${identString}' 不存在`)
      return
   }

   addConsumableItemImpl(gameContext, item, identString, count)
}

export function giveRechargeableItem(gameContext: GameContext, itemId: Ident, chargeLevel?: number) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.rechargeableItems[identString]
   if (!item) {
      console.error(`[E] [giveRechargeableItem] 可充能物品 '${identString}' 不存在`)
      return
   }

   chargeLevel = chargeLevel || item.initCharge || item.maxCharge!
   addRechargeableItemImpl(gameContext, item, identString, chargeLevel)
}

export function giveActiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.activeRelicItems[identString]
   if (!item) {
      console.error(`[E] [giveActiveRelicItem] 具有主动技能的物品 '${identString}' 不存在`)
      return
   }

   addActiveRelicItemImpl(gameContext, item, identString)
}

export function givePassiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.passiveRelicItems[identString]
   if (!item) {
      console.error(`[E] [givePassiveRelicItem] 被动型物品 '${identString}' 不存在`)
      return
   }

   addPassiveRelicItemImpl(gameContext, item, identString)
}

export function giveTradableItem(gameContext: GameContext, itemId: Ident, count?: number) {
   count = count || 1

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const item = gameContext.ruleSet.storeItems.tradableItems[identString]
   if (!item) {
      console.error(`[E] [giveTradableItem] 可交易物品 '${identString}' 不存在`)
      return
   }

   addTradableItemImpl(gameContext, item, identString, count)
}

export function useConsumableItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const playerItem = gameContext.state.player.items.consumableItems[identString]
   if (!playerItem) {
      console.error(`[E] [useConsumableItem] 消耗品 '${identString}' 不存在`)
      return
   }

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
      console.error(`[E] [useRechargeableItem] 可充能物品 '${identString}' 不存在`)
      return
   }

   if (playerItem.chargeLevel === 0) {
      console.error(`[E] [useRechargeableItem] 物品 '${identString}' 没有充能层数`)
      return
   }

   triggerEventSeries(gameContext, playerItem.item.consumeEvents)
   playerItem.chargeLevel -= 1
}

export function useActiveRelicItem(gameContext: GameContext, itemId: Ident) {
   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const playerItem = gameContext.state.player.items.activeRelicItems[identString]
   if (!playerItem) {
      console.error(`[E] [useActiveRelicItem] 具有主动技能的物品 '${identString} 不存在'`)
      return
   }

   if (playerItem.cooldown !== 0) {
      console.error(`[E] [useActiveRelicItem] 物品 '${identString}' 尚未冷却完毕`)
      return
   }

   triggerEventSeries(gameContext, playerItem.item.activateEvents)
   playerItem.cooldown = playerItem.item.cooldown
}

export function rechargeItem(gameContext: GameContext, itemId: Ident, chargeLevel?: number) {
   chargeLevel = chargeLevel || 1

   const identString = mStoreItemId(ensureScope(gameContext), itemId)
   const playerItem = gameContext.state.player.items.rechargeableItems[identString]
   if (!playerItem) {
      console.error(`[E] [rechargeItem] 可充能物品 '${identString}' 不存在`)
      return
   }

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
      console.error(`[E] [addItemToShop] '${kind}' 类别的物品 '${identString}' 不存在`)
      return
   }

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
            console.warn('[W] [addItemToShop] 原则上来说，可充能物品/具有主动技能的物品/被动型物品是唯一的')
         }
         const shop = <Record<string, StoreItem<any>>>gameContext.state.shop[k]
         if (shop[identString]) {
            console.warn(`[W] [addItemToShop] 物品 '${identString}' 已经存在于商店里了`)
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
      console.error(`[E] [removeItemFromShop] '${kind}' 类别的物品 '${identString}' 不存在`)
      return
   }

   const shop = <Record<string, any>>gameContext.state.shop[k]
   delete shop[identString]
}

function checkPrice<IKS extends StoreItemKind>(gameContext: GameContext, item: StoreItem<IKS>, count?: number) {
   const totalPrice = (item.price || 0) * (count || 1)
   const playerMoney = getPropertyValue(gameContext, '@money')!
   if (totalPrice > playerMoney) {
      const itemId = mStoreItemId(ensureScope(gameContext, item.scope), item.ident)

      console.error(`[E] [checkPrice] 没有足够的钱来购买物品 ${itemId}，需要 ${totalPrice}，但你只有 ${playerMoney}`)
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
      console.error(`[E] [purchaseConsumableItem] 消耗品 '${identString}' 不存在或者尚未上架`)
      return
   }

   if (count > shopItemCount) {
      console.error(`[E] [purchaseConsumableItem] 商店中没有足够的 '${identString}': 期望 ${count}, 实际 ${shopItemCount}`)
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
      console.error(`[E] [purchaseRechargeableItem] 可充能物品 '${identString}' 不存在或者尚未上架`)
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
      console.error(`[E] [purchaseActiveRelicItem] 具有主动技能的物品 '${identString}' 不存在或者尚未上架`)
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
      console.error(`[E] [purchasePassiveRelicItem] 被动性物品 '${identString}' 不存在或者尚未上架`)
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
      console.error(`[E] [purchaseTradableItem] 可交易物品 '${identString}' 不存在或者尚未上架`)
      return
   }

   if (shopItemCount < count) {
      console.error(`[E] [purchaseTradableItem] 商店中没有足够的 '${identString}': 期望 ${count}, 实际 ${shopItemCount}`)
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
      console.error(`[E] [sellTradableItem] 物品 '${identString}' 不存在，或者玩家没有此物品`)
      return
   }

   if (playerItem.count < count) {
      console.error(`[E] [sellTradableItem] 玩家没有足够的 '${identString}' 用于出售: 期望 ${count}, 实际 ${playerItem.count}`)
      return
   }

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
