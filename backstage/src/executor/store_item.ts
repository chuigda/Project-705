import { GameContext } from '@app/executor/game_context'
import { Ident, mStoreItemId } from '@app/base/uid'
import { RuleSetStoreItems, StoreItemKind } from '@app/ruleset'

const kindToFieldMapping: Record<StoreItemKind, keyof RuleSetStoreItems> = {
   'consumable': 'consumableItems',
   'rechargeable': 'rechargeableItems',
   'active_relic': 'activeRelicItems',
   'passive_relic': 'passiveRelicItems',
   'tradable': 'tradableItems'
}

export function giveConsumableItem(gameContext: GameContext, itemId: Ident, count?: number) {}

export function giveRechargeableItem(gameContext: GameContext, itemId: Ident, chargeLevel?: number) {}

export function giveActiveRelicItem(gameContext: GameContext, itemId: Ident) {}

export function givePassiveRelicItem(gameContext: GameContext, itemId: Ident) {}

export function giveTradableItem(gameContext: GameContext, itemId: Ident) {}

export function purchaseConsumableItem(gameContext: GameContext, itemId: Ident, count?: number) {}

export function useConsumableItem(gameContext: GameContext, itemId: Ident) {}

export function useRechargeableItem(gameContext: GameContext, itemId: Ident) {}

export function useActiveRelicItem(gameContext: GameContext, itemId: Ident) {}

export function sellTradableItem(gameContext: GameContext, itemId: Ident) {}

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
